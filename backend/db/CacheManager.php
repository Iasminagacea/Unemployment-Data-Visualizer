<?php

class CacheManager {
    private $cacheDir;
    private $cacheLifetime;

    public function __construct($lifetime = 3600) { 
        $this->cacheDir = __DIR__ . '/../cache/';
        $this->cacheLifetime = $lifetime;
        
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }

    public function getCacheKey($prefix, $params) {
        return md5($prefix . json_encode($params));
    }

    public function get($key) {
        $filePath = $this->cacheDir . $key . '.cache';
        
        if (file_exists($filePath)) {
            $fileTime = filemtime($filePath);
            if (time() - $fileTime < $this->cacheLifetime) {
                return json_decode(file_get_contents($filePath), true);
            }
            unlink($filePath);
        }
        return null;
    }

    public function set($key, $value) {
        $filePath = $this->cacheDir . $key . '.cache';
        file_put_contents($filePath, json_encode($value), LOCK_EX);
    }

    public function invalidate($pattern = null) {
        if ($pattern === null) {
            array_map('unlink', glob($this->cacheDir . '*.cache'));
        } else {
            array_map('unlink', glob($this->cacheDir . $pattern . '*.cache'));
        }
    }
}
?>