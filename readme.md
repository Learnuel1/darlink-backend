
# DARLINK BACKEND API SERVER FOR DASHBOARD (USER AND ADMIN)

This is the backend API Server for the Darlink User and Admin dashboards.

## STACKS

## Main

1. Node
2. ExpressJS
3. SqlDB

- Package Manager: `npm`

## GET STARTED

1. Clone the repo and install dependencies using `npm install`
2. Duplicate the `.env.example.show` and rename one of them ot `.env`
3. Update the `.env with the appropriate values.
4. Install `mssql` and `msnodesqlv8` drivers using `npm i mssql -save` and `npm i msnodesqlv8` respectively.
5. Goto `src/config/database/index.js` and update the  `server` field with the instance of your `SQL server instance`.
6. In the `database` folder : `copy` the content of `Table_creations.sql` and `script.sql` and execute in your `SQL SERVER`respectively.
7. Use `npm run dev` to run the server locally

### API DOC 
`https://darlink-backend.vercel.app`

## APPLICATION DESCRIPTION

 https://solo-2.vercel.app/



## Sample Site

 Study this http://solo.to..This is what you are replicating

 Project Tasks flow.

1. Creation of git repo

2. Project features and detail

3. Fronted design (pages layout, design) - Customer pages and admin

4. Creation  of Database (Test db)

5. Backed implementation (backend codes and logics) Customer and admin functionalities 

6. Testing (On demo db and hosting url)

7.Test Deployment(QA)

8. Live hosting Test.


9. Live deployment (for customers to start using it)

### APPLICATION FEATURES

**These are project features**

1. Landing page 
2. Create account and choose plan.
3. Sign in
4. Pricing page ***4b*** Upgrade plan
5. How it works
6. Forget Password 
7. Payment checkout

8. Dashboard 
9. My page/profile/appearance /Links Embed,Buttons and Integration, Upload product pictures (max 6)

10. Analytic

11. Profile detail 

12. My page Preview

14. Create Wallet / Fund Wallet
15. Payment / Checkout
 
16. Admin login, Dashboard,   Confirm payments, Delete customer, Upgrade View all accounts.