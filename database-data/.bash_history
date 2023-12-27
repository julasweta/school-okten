mongoimport --username=julasweta --password=19731971 --authenticationDatabase=admin --db=school --collection=orders --jsonArray < /data/db/orders.dump
ls /data/db/
mongoimport --username=julasweta --password=19731971 --authenticationDatabase=admin --db=school --collection=orders --jsonArray < /data/db/orders.dump
cat /data/db/orders.dump
exit
cat /data/db/orders.dump
docker exec -i b5c223c8a28d mongorestore --username julasweta --password 19731971 --authenticationDatabase admin --db school /data/db/
mongorestore --username julasweta --password 19731971 --authenticationDatabase admin --db school /data/db/
mongo --username julasweta --password 19731971 --authenticationDatabase admin --host localhost --port 27017 school
exit
