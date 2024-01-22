import os
import boto3
import psycopg2
from psycopg2.extensions import AsIs

dbSecret = {
    "username": "nwHack",
    "password": "Aj6xnEqXJdBGoyr26.T8sINq4qvQ_h",
    "host":"dbstack-nwhackdb5b652d64-jjo5iobptmgd.cbu82waouzw2.ca-central-1.rds.amazonaws.com",
    "dbname": "nwHackDB"
}
connection = psycopg2.connect(
    user=dbSecret["username"],
    password=dbSecret["password"],
    host=dbSecret["host"],
    dbname=dbSecret["dbname"],
)
cursor = connection.cursor()

def handler(event, context):
    try:
        # Could be used for test
        delete_table = """
            DROP TABLE IF EXISTS applicationList;
        """
        cursor.execute(delete_table)
        connection.commit()

        #
        ## Create tables and schema
        ##
        
        # Created 4 tables based on the schema
        sqlTableCreation = """
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE IF NOT EXISTS "applications" (
                "user_id" uuid,
                "project_id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
                "project_name" varchar,
                "selected_resources" varchar[],
                "created_date" timestamp DEFAULT (now())
            );
        """
        
        # Execute table creation
        cursor.execute(sqlTableCreation)
        connection.commit()

        # Close cursor and connection
        cursor.close()
        connection.close()

        print("Initialization completed")
    except Exception as e:
        print(e)
