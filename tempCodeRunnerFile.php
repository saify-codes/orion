<?php
declare(strict_types=1);

/**
 * One-file ABAC + SQLite persistence.
 * - Auto-creates SQLite file ./abac.sqlite on first run
 * - REST-ish POST API (see curl examples at bottom)
 *
 * Actions:
 *   POST action=seed_demo
 *   POST action=check  resource=todos|comments  op=view|create|update|delete  user_id=... [resource_id=...]
 *   POST action=create_todo  user_id=...  title=...  [invited_users_json='["2","3"]']
 *   POST action=update_todo  user_id=...  todo_id=...  [title=..] [completed=0|1] [invited_users_json=...]
 *   POST action=delete_todo  user_id=...  todo_id=...
 *   POST action=create_comment user_id=... body=... [todo_id=...]
 *   POST action=update_comment user_id=... comment_id=... body=...
 */

header('Content-Type: application/json');

// ---------------------- DB bootstrap ----------------------
$pdo = new PDO('sqlite:' . __DIR__ . '/abac.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create tables if missing
$pdo->exec("
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  blocked_by_json TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS roles (
  name TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_name TEXT NOT NULL,
  PRIMARY KEY(user_id, role_name),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(role_name) REFERENCES roles(name) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  invited_users_json TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  todo_id INTEGER,
  FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(todo_id) REFERENCES todos(id) ON DELETE SET NULL
);
");

// ---------------------- Helpers ----------------------
function j($ok, $data = []) {
  echo json_encode(['ok' => $ok] + $data, JSON_PRETTY_PRINT); exit;
}
function arr($v): array { return is_array($v) ? $v : (is_string($v) && $v !== '' ? json_decode($v, true) ?: [] : []); }
function boolish($v): bool { return in_array((string)$v, ['1','true','on','yes'], true); }

function getUser(PDO $pdo, string $id): ?array {
  $st = $pdo->prepare("SELECT id, blocked_by_json FROM users WHERE id = :id");
  $st->execute([':id'=>$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) return null;
  // roles
  $r = $pdo->prepare("SELECT role_name FROM user_roles WHERE user_id=:id");
  $r->execute([':id'=>$id]);
  $roles = array_column($r->fetchAll(PDO::FETCH_ASSOC), 'role_name');
  return [
    'id' => $row['id'],
    'blockedBy' => arr($row['blocked_by_json']),
    'roles' => $roles,
  ];
}
function getTodo(PDO $pdo, int $id): ?array {
  $st = $pdo->prepare("SELECT * FROM todos WHERE id=:id");
  $st->execute([':id'=>$id]);
  $t = $st->fetch(PDO::FETCH_ASSOC);
  if (!$t) return null;
  return [
    'id' => (string)$t['id'],
    'userId' => (string)$t['user_id'],
    'title' => $t['title'],
    'completed' => (bool)$t['completed'],
    'invitedUsers' => arr($t['invited_users_json']),
  ];
}
function getComment(PDO $pdo, int $id): ?array {
  $st = $pdo->prepare("SELECT * FROM comments WHERE id=:id");
  $st->execute([':id'=>$id]);
  $c = $st->fetch(PDO::FETCH_ASSOC);
  if (!$c) return null;
  return [
    'id' => (string)$c['id'],
    'authorId' => (string)$c['author_id'],
    'body' => $c['body'],
    'todoId' => $c['todo_id'] !== null ? (int)$c['todo_id'] : null,
  ];
}

// ---------------------- ABAC policy (same as your JS) ----------------------
$ROLES = [
  'admin' => [
    'comments' => ['view'=>true,'create'=>true,'update'=>true],
    'todos'    => ['view'=>true,'create'=>true,'update'=>true,'delete'=>true],
  ],
  'moderator' => [
    'comments' => ['view'=>true,'create'=>true,'update'=>true],
    'todos'    => [
      'view'=>true,'create'=>true,'update'=>true,
      'delete'=>function(array $user, array $todo): bool { return !empty($todo['completed']); }
    ],
  ],
  'user' => [
    'comments' => [
      'view'=>function(array $user, array $comment): bool {
        return !in_array($comment['authorId'] ?? null, $user['blockedBy'] ?? [], true);
      },
      'create'=>true,
      'update'=>function(array $user, array $comment): bool {
        return ($comment['authorId'] ?? null) === ($user['id'] ?? null);
      },
    ],
    'todos' => [
      'view'=>function(array $user, array $todo): bool {
        return !in_array($todo['userId'] ?? null, $user['blockedBy'] ?? [], true);
      },
      'create'=>true,
      'update'=>function(array $user, array $todo): bool {
        $uid = $user['id'] ?? null;
        return (($todo['userId'] ?? null) === $uid) || in_array($uid, $todo['invitedUsers'] ?? [], true);
      },
      'delete'=>function(array $user, array $todo): bool {
        $uid = $user['id'] ?? null;
        $ownOrInv = (($todo['userId'] ?? null) === $uid) || in_array($uid, $todo['invitedUsers'] ?? [], true);
        return $ownOrInv && !empty($todo['completed']);
      },
    ],
  ],
];

function hasPermission(array $user, string $resource, string $action, ?array $data = null): bool {
  global $ROLES;
  foreach (($user['roles'] ?? []) as $role) {
    $rule = $ROLES[$role][$resource][$action] ?? null;
    if ($rule === null) continue;
    if (is_bool($rule) && $rule === true) return true;
    if (is_callable($rule) && $data !== null && $rule($user, $data)) return true;
  }
  return false;
}

// ---------------------- API routes ----------------------
$action = $_POST['action'] ?? '';

if ($action === 'seed_demo') {
  // roles
  $pdo->exec("INSERT OR IGNORE INTO roles(name) VALUES ('admin'),('moderator'),('user')");
  // users
  $insU = $pdo->prepare("INSERT OR REPLACE INTO users(id, blocked_by_json) VALUES (:id,:b)");
  $insU->execute([':id'=>'1',':b'=>json_encode(['2'])]); // user 1 blocked by 2
  $insU->execute([':id'=>'2',':b'=>json_encode([])]);
  $insU->execute([':id'=>'9',':b'=>json_encode([])]);
  // roles mapping
  $pdo->exec("INSERT OR IGNORE INTO user_roles(user_id, role_name) VALUES 
    ('1','user'), ('2','admin'), ('9','moderator')");
  // todos
  $pdo->exec("DELETE FROM todos"); // reset for demo
  $pdo->exec("DELETE FROM comments");
  $insT = $pdo->prepare("INSERT INTO todos(user_id,title,completed,invited_users_json) VALUES (?,?,?,?)");
  $insT->execute(['1','Test Todo',0,json_encode([])]);  // id 1 owner 1
  $insT->execute(['9','Mod Todo',1,json_encode(['1'])]); // id 2 owner 9, completed, invited 1
  j(true, ['msg'=>'Seeded demo data. Users: 1(user), 2(admin), 9(moderator). Todos: 1,2.']);
}

if ($action === 'check') {
  $userId   = (string)($_POST['user_id'] ?? '');
  $resource = (string)($_POST['resource'] ?? '');
  $op       = (string)($_POST['op'] ?? '');
  $resId    = $_POST['resource_id'] ?? null;

  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);

  $data = null;
  if ($resource === 'todos' && $resId) {
    $data = getTodo($pdo, (int)$resId);
    if (!$data) j(false, ['error'=>'todo not found']);
  } elseif ($resource === 'comments' && $resId) {
    $data = getComment($pdo, (int)$resId);
    if (!$data) j(false, ['error'=>'comment not found']);
  }

  $allow = hasPermission($user, $resource, $op, $data);
  j(true, ['allow'=>$allow]);
}

if ($action === 'create_todo') {
  $userId = (string)($_POST['user_id'] ?? '');
  $title  = trim((string)($_POST['title'] ?? ''));
  $inv    = arr($_POST['invited_users_json'] ?? '[]');

  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);
  if (!$title) j(false, ['error'=>'title required']);

  if (!hasPermission($user, 'todos', 'create', null)) {
    j(true, ['allow'=>false, 'error'=>'forbidden']);
  }

  $st = $pdo->prepare("INSERT INTO todos(user_id,title,completed,invited_users_json) VALUES (:u,:t,0,:inv)");
  $st->execute([':u'=>$userId, ':t'=>$title, ':inv'=>json_encode(array_values($inv))]);
  j(true, ['id'=>$pdo->lastInsertId(), 'allow'=>true]);
}

if ($action === 'update_todo') {
  $userId = (string)($_POST['user_id'] ?? '');
  $todoId = (int)($_POST['todo_id'] ?? 0);
  $todo = getTodo($pdo, $todoId);
  if (!$todo) j(false, ['error'=>'todo not found']);
  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);

  if (!hasPermission($user, 'todos', 'update', $todo)) {
    j(true, ['allow'=>false, 'error'=>'forbidden']);
  }

  $title = array_key_exists('title', $_POST) ? (string)$_POST['title'] : $todo['title'];
  $completed = array_key_exists('completed', $_POST) ? (int)boolish($_POST['completed']) : (int)$todo['completed'];
  $inv = array_key_exists('invited_users_json', $_POST) ? json_encode(array_values(arr($_POST['invited_users_json']))) : json_encode($todo['invitedUsers']);

  $st = $pdo->prepare("UPDATE todos SET title=:t, completed=:c, invited_users_json=:inv WHERE id=:id");
  $st->execute([':t'=>$title, ':c'=>$completed, ':inv'=>$inv, ':id'=>$todoId]);

  j(true, ['allow'=>true, 'updated'=>['title'=>$title,'completed'=>(bool)$completed,'invitedUsers'=>json_decode($inv,true)]]);
}

if ($action === 'delete_todo') {
  $userId = (string)($_POST['user_id'] ?? '');
  $todoId = (int)($_POST['todo_id'] ?? 0);
  $todo = getTodo($pdo, $todoId);
  if (!$todo) j(false, ['error'=>'todo not found']);
  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);

  if (!hasPermission($user, 'todos', 'delete', $todo)) {
    j(true, ['allow'=>false, 'error'=>'forbidden']);
  }

  $st = $pdo->prepare("DELETE FROM todos WHERE id=:id");
  $st->execute([':id'=>$todoId]);
  j(true, ['allow'=>true, 'deleted'=>$todoId]);
}

if ($action === 'create_comment') {
  $userId = (string)($_POST['user_id'] ?? '');
  $body   = trim((string)($_POST['body'] ?? ''));
  $todoId = isset($_POST['todo_id']) ? (int)$_POST['todo_id'] : null;

  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);
  if (!$body) j(false, ['error'=>'body required']);

  if (!hasPermission($user, 'comments', 'create', null)) {
    j(true, ['allow'=>false, 'error'=>'forbidden']);
  }

  $st = $pdo->prepare("INSERT INTO comments(author_id, body, todo_id) VALUES (:a,:b,:t)");
  $st->execute([':a'=>$userId, ':b'=>$body, ':t'=>$todoId]);
  j(true, ['allow'=>true, 'id'=>$pdo->lastInsertId()]);
}

if ($action === 'update_comment') {
  $userId = (string)($_POST['user_id'] ?? '');
  $commentId = (int)($_POST['comment_id'] ?? 0);
  $body = trim((string)($_POST['body'] ?? ''));

  $user = getUser($pdo, $userId);
  if (!$user) j(false, ['error'=>'user not found']);
  $comment = getComment($pdo, $commentId);
  if (!$comment) j(false, ['error'=>'comment not found']);

  if (!hasPermission($user, 'comments', 'update', $comment)) {
    j(true, ['allow'=>false, 'error'=>'forbidden']);
  }
  if ($body === '') j(false, ['error'=>'body required']);

  $st = $pdo->prepare("UPDATE comments SET body=:b WHERE id=:id");
  $st->execute([':b'=>$body, ':id'=>$commentId]);
  j(true, ['allow'=>true, 'updated'=>['id'=>$commentId,'body'=>$body]]);
}

// Default
j(false, ['error'=>'unknown action']);