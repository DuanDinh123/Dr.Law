#!/bin/bash

set -e

SPACE_NAME=mongo-backup-demo
BACKUP_NAME=$(date +%y%m%d_%H%M%S)
DB=test

echo "Dumping MongoDB $DB database to compressed archive" 
mongodump --db $DB --username admin --password admin --authenticationDatabase admin --out $BACKUP_NAME\


echo 'Backup complete!'
