'use client';

import { useState } from 'react';
import { User } from './user-data';
import Link from 'next/link';


export default function UserList({ users, initialListUsers = [] } : { users: User[], initialListUsers: User[]}) {

const [listUsers, setListUsers] = useState(initialListUsers)

async function addToListUsers(userId: string) {
    const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST', 
        body: JSON.stringify({
            userId,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const updatedListUsers = await response.json();
    setListUsers(updatedListUsers);

}

async function removeFromListUsers(userId: string) {
    const response = await fetch('http://localhost:3000/api/users', {
        method: 'DELETE', 
        body: JSON.stringify({
            userId,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const updatedListUsers = await response.json();
    setListUsers(updatedListUsers);

}

function usersIsInList(userId: string) {
    return listUsers.some(cp => cp.id === userId);
}

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {users.map(user => (
        <Link key ={user.id}
            href={`/users/${user.id}`}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600">${user.description}</p>
            {
                usersIsInList(user.id)
                ? (
                    <button onClick={(e) => {
                    e.preventDefault();
                    removeFromListUsers(user.id);
                    }}>Remove from List</button>

                ) : (
                    <button onClick={(e) => {
                        e.preventDefault();
                        addToListUsers(user.id);
                    }}>Add to Cart</button>
                )
            }

        </Link>
        ))}
        </div>
    )
}



