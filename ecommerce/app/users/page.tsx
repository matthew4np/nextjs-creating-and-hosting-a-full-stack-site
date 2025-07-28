import UsersList from "../UserList";

export const dynamic = 'force-dynamic';

export default async function Users() {

    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();

    const response2 = await fetch('http://localhost:3000/api/users/2/cart', {
        cache : 'no-cache',
    })

    const listUsers = await response2.json();

    return (
        <>
        <h1>Users</h1>
        <UsersList users={users} initialListUsers={listUsers}/>
        </>
    )
}