<?php

$version = '0.0.0.0';
$secret  = 'secvariableret';

$items   = [
    [
        'item_id'       => 1,
        'item_name'     => 'burger',
        'item_price'    => 1000,
        'addons'        => [
            [
                'addon_id'      => 1,
                'addon_name'    => 'extra sauce',
                'addon_price'   => 10,
            ]
        ]
    ],
    [
        'item_id'       => 2,
        'item_name'     => 'sandwitch',
        'item_price'    => 500,
    ],
    [
        'item_id'       => 3,
        'item_name'     => 'cake',
        'item_price'    => 100,
    ],
];

foreach ($items as &$item) {
    

    if (isset($item['addons'])) {
        foreach ($item['addons'] as &$addon) {
            $addon['signed_token'] = signAddon($addon);
        }
    }
    
    $item['signed_token'] = signItem($item);
}

function signItem($item){
    global $secret;
    global $version;
    return hash_hmac('sha256', sprintf("%d.%d.%s", $item['item_id'], $item['item_price'], $version), $secret);
}

function signAddon($addon){
    global $secret;
    global $version;
    return hash_hmac('sha256', sprintf("%d.%d.%s", $addon['addon_id'], $addon['addon_price'], $version), $secret);
}

function verifyItemSignature($item){

    if (!isset($item['signed_token'])) {
        return false;
    }

    print $item['signed_token'];
    print "\n";
    print signItem($item);
    print "\n";

    return hash_equals($item['signed_token'], signItem($item));
}

function placeOrder($item){

    if(verifyItemSignature($item)){
        echo "Order placed";
    }else{
        echo "Payload corrupted";
    }

}


// placeOrder($items);

print_r($items);