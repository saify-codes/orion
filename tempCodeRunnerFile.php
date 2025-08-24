<?php


$version = "0.0.0.0";


function increment(){

    global $version;

    [$a, $b, $c, $d] = array_map('intval', explode(".",$version));

    $d++;

    if ($d > 100) {
        $c++;
        $d = 0;
    }

    if ($c > 100) {
        $b++;
        $c = 0;
    }

    if ($b > 100) {
        $a++;
        $b = 0;
    }

    // reset
    if ($a > 100) {
        $a = $b = $c = $d = 0;
    }

    $version = sprintf("%s.%s.%s.%s", $a, $b, $c, $d);
}


for ($i=0; $i < 100000000; $i++) { 
    increment();
    print $version . "\n";
}