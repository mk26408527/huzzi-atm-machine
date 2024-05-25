#! /usr/bin/env node

import inquirer from "inquirer";

const predefinedUserID = "1230"; // Define the specific User ID
const predefinedPin = 1230; // Define the specific PIN
let accountBalance = 10000000; // Define the initial balance of 10 million rupees

interface UserInput {
  userID: string;
  userPin: number;
  accountType: string;
  transactionType: string;
  amount: number;
}

// Function to prompt for transactions
async function promptForTransaction() {
  const userInput: UserInput = await inquirer.prompt([
    {
      type: "list",
      name: "accountType",
      choices: ["Current", "Saving"],
      message: "Select Your Account Type",
    },
    {
      type: "list",
      name: "transactionType",
      choices: ["Fast Cash", "Cash Withdraw", "Balance Inquiry"],
      message: "Select Your Transaction",
    },
    {
      type: "number",
      name: "amount",
      message: "Enter Amount you want to withdraw",
      when(userInput) {
        return userInput.transactionType === "Cash Withdraw";
      },
    },
    {
      type: "list",
      name: "amount",
      choices: [1000, 2000, 5000, 10000, 20000, 25000],
      message: "Select amount you want to withdraw",
      when(userInput) {
        return userInput.transactionType === "Fast Cash";
      },
    },
  ]);

  const enteredAmount = userInput.amount;

  if (userInput.transactionType === "Balance Inquiry") {
    console.log(`Your current balance is Rs ${accountBalance}\n`);
  } else {
    if (accountBalance >= enteredAmount) {
      accountBalance -= enteredAmount;
      console.log(
        `Your account has been debited with Rs ${enteredAmount} and your remaining balance is Rs ${accountBalance}`
      );
    } else {
      console.log(`\nInsufficient Balance`);
    }
  }

  // Prompt for another transaction
  const { anotherTransaction }: { anotherTransaction: string } =
    await inquirer.prompt([
      {
        type: "confirm",
        name: "anotherTransaction",
        message: "Do you want to perform another transaction?",
        default: false,
      },
    ]);

  if (anotherTransaction) {
    await promptForTransaction(); // Recursive call to handle more transactions
  } else {
    console.log("Thank you for using our ATM. Goodbye have a nice day!");
  }
}

// Prompt for user ID and PIN first
const { userID }: { userID: string } = await inquirer.prompt([
  {
    type: "input",
    name: "userID",
    message: "Enter User ID",
  },
]);

// Check if the User ID is correct before proceeding
if (userID !== predefinedUserID) {
  console.log("Your User ID is incorrect");
  process.exit(); // Exit the process if the User ID is incorrect
}

// Prompt for PIN if User ID is correct
const { userPin }: { userPin: number } = await inquirer.prompt([
  {
    type: "number",
    name: "userPin",
    message: "Enter your Pin",
  },
]);

// Check if the PIN is correct before proceeding
if (userPin !== predefinedPin) {
  console.log("Your pin is incorrect");
  process.exit(); // Exit the process if the PIN is incorrect
}

// Start transaction loop if User ID and PIN are correct
await promptForTransaction();
