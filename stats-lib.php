<?php
// Shared by hit.php and stats.php: where the anonymous event logs live.
// Outside every web root (the home folder), so they can't be downloaded
// directly; stats.php is the only way to read them.

const STATS_SITES = ['cnp', 'quiz'];

function stats_dir(): string {
  $home = dirname(__DIR__, 2); // public_html/kallistesoft.ca → home folder
  $dir = $home . '/kallistesoft-stats';
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  return $dir;
}
