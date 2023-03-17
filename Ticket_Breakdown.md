# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

# Ticket 1 - Add custom id field to the Agents table

Description: To enable Facilities to assign custom IDs to Agents, we need to add a "custom_id" field to the Agents table.

Implementation details: Create a migration that add the column "custom_id" to the table Agents. The column should be a varchar with maximum of 50 characters, not nullable and not unique. 

Acceptance criteria:

- A new field "custom_id" has been added to the Agents table.
- The "custom_id" field accepts and stores string values up to 50 characters in length.

Effort Estimate: 2 hours

# Ticket 2 - Update the API to allow Agents to receive the custom id

Description: Facilities need a way to set custom ids for Agents that they work with. 

If the custom id is not defined, save the id in the custom_id column

Implementation details:

- Change the entity, dto, routes, controller, repository and usecases of the POST and PATCH /agents endpoints to receive the "custom_id" param in the body of the request. We should be able to insert a agent with custom_id and update the custom_id of an existing agent.
- Make the validation checking if the size maximum is 50. It should not be required and should not allow values that already exists

Acceptance criteria: 

- The endpoints POST and PATCH /agents accepts requests with a JSON payload containing "custom_id" with the value.
- The custom_id field in the Agents table is inserted/updated with the new value.
- The API response for the POST, PATCH and GET /agents endpoint includes the custom_id field for each Agent.
- The API should returns 400 if the "custom_id" validation fails

Effort Estimate: 12 hours

# Ticket 3 - Change the generating report to include the custom id

Description: 

Implementation Details:

- Update the function generateReport to use the custom_id field instead of the internal id for each Agent in the report

Acceptance Criteria:

- If a custom_id is not available for an Agent, the internal database id should be used as a fallback.
- The generateReport function is updated to use the custom_id field for each Agent in the report.
- The generated PDF report includes the custom_id for each Agent, or the internal database id if a custom_id is not available.

Effort Estimate: 4 hours