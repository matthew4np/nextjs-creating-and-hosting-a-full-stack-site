export default async function FetchTest() {

    const response = await fetch('http://127.0.0.1:3000/api/hello');
    const data = await response.json();
    
    return <h1>{data.message}</h1>
}