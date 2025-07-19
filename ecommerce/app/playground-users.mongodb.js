/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('ecommerce-nextjs');

// Insert a few documents into the sales collection.
db.getCollection('users').insertMany([
{
  id: 'u123',
  name: 'User u123',
  description: 'Description u123',
}, {
  id: 'u234',
  name: 'User u234',
  description: 'Description u234',
}, {
    id: 'u345',
  name: 'User u345',
  description: 'Description u345',
}, {
  id: 'u456',
  name: 'Apron',
  description: 'Description u456',
}
]);

console.log(db.collection('users').find({}));


