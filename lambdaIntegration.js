const { initializeConnection } = require("./lib.js");

// Setting up evironments
let { SM_DB_CREDENTIALS } = process.env;

// SQL conneciton from global variable at lib.js
let sqlConnection = global.sqlConnection;

exports.handler = async (event) => {
	const response = {
		statusCode: 200,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
		body: "",
	};

	// Initialize the database connection if not already initialized
	if (!sqlConnection) {
		await initializeConnection(SM_DB_CREDENTIALS);
		sqlConnection = global.sqlConnection;
	}

	let data;
	try {
		const pathData = event.httpMethod + " " + event.resource;
		switch(pathData) {
			case "GET /appData":
				console.log("event.queryStringParameters: ", event.queryStringParameters);
				if(event.queryStringParameters != null){
					const bd = event.queryStringParameters;
					
					if(bd.user_id && bd.project_id){
						data = await sqlConnection`SELECT * FROM applications WHERE user_id = ${bd.user_id} AND project_id = ${bd.project_id};`;
						
						response.body = JSON.stringify(data);
					} else if(bd.user_id){
						console.log("Hit!!");
						data = await sqlConnection`SELECT * FROM applications WHERE user_id = ${bd.user_id};`;
		
						response.body = JSON.stringify(data);				
					} else {
						response.statusCode = 400;
						response.body = "Invalid value";
					}
				} else {
					response.statusCode = 400;
					response.body = "Invalid value";
				}
				break;
			case "POST /appData":
				if(event.body != null){
					const bd = JSON.parse(event.body);
					
					// Check if required parameters are passed
					if (bd.user_id && bd.project_name) {
						// List of resources
						const selected_resources = bd.selected_resources ? bd.selected_resources : [];
						
						data = await sqlConnection`
							INSERT INTO applications (user_id, project_name, selected_resources)
							VALUES (${bd.user_id}, ${bd.project_name}, ${selected_resources})
							RETURNING *;
						`;
						
						response.body = JSON.stringify(data);
					} else {
						response.statusCode = 400;
						response.body = "Invalid value";
					}
				} else {
					response.statusCode = 400;
					response.body = "Invalid value";	
				}
				break;
			case "PUT /appData":
				if(event.body != null && event.queryStringParameters != null){
					const bd = JSON.parse(event.body);

					// Check if required parameters are passed
					if (bd.project_name && bd.selected_resources && event.queryStringParameters.user_id && event.queryStringParameters.project_id) {
						data = await sqlConnection`
							UPDATE applications
							SET project_name = ${bd.project_name}, 
								selected_resources = ${bd.selected_resources}
							WHERE user_id = ${event.queryStringParameters.user_id} AND project_id = ${event.queryStringParameters.project_id};
						`;
						response.body = "Updated the project";
					} else {
						response.statusCode = 400;
						response.body = "Invalid value";
					}
				} else {
					response.statusCode = 400;
					response.body = "Invalid value";	
				}
				break;
			case "DELETE /appData":
				if(event.queryStringParameters != null && event.queryStringParameters.user_id && event.queryStringParameters.project_id){
					data = await sqlConnection`DELETE FROM applications WHERE user_id = ${event.queryStringParameters.user_id} AND project_id = ${event.queryStringParameters.project_id};`;
					response.body = "Deleted the project!";
				} else {
					response.statusCode = 400;
					response.body = "Invalid value";	
				}
				break;
			default:
				throw new Error(`Unsupported route: "${pathData}"`);
		}
	} catch (error) {
		response.statusCode = 400;
		console.log(error);
    	response.body = JSON.stringify(error.message);
	}
	
	return response;
};