# CalEvents

CalEvnets is a web application that combiens schedule management and event ticketing service into one.

## Database Information

``` 
Credentials
host: csci3100-proj.cobhjw2xjj8l.us-east-1.rds.amazonaws.com
port: 3306
Username: root
Password: csci3100
```

```
Database Schema

User
	- type (normal / organizers) -> tinyint
	- user_id -> int (primary key, auto increment)
	- username -> varchar(30) 
	- password -> varchar(60)
	- email -> varchar(255)
	- img_loc -> varchar(60)
	- account_balance -> float(default 0)
Password_Recovery
	- user_id -> int (primary key, foreign key -> Users.user_id)
    	- token (hash()) -> varchar(60)
	- expires_at -> datetime
Event
	- visible -> tinyint
	- event_id -> int (primary key, auto increment)
	- name -> varchar(100)
	- start_date -> date (primary key)
	- start_time -> time (primary key)
	- end_date -> date
	- end_time -> time
	- repeat_every_week -> tinyint
	- venue -> varchar(100)
	- capcity -> int
	- description -> text
	- img_loc -> varchar(60)
	- organizers (forign key -> User.user_id)
	- ticket -> int
	- allow_refund -> tinyint
	- days_for_refund -> int (A SQL event is scheduled to update the field at 00:00:00 every day)
	- category -> varchar(30)
Event_Join
	- user_id -> int (primary key, foreign key User.user_id)
	- event_id -> int (primary key, foreign key Event.event_id)
Prepaid_Card
	- card_id -> int (primary key)
	- card_password -> varchar(30)
	- value	-> int
	- user_id (foreign key User.user_id)

```
## JSON server
Run JSON server by typing **npm run server** in the folder **calevent**. The server runs on port 5000. Data is stored in **db.json**.

## Routes (Temporary)
```
'/' 		// Home Page
'/login' 	// Login Page (included Login, Sign up and reset password) 
'/myCalendar'	// My Calendar Page
'/saerch'	// Search Page 
```
