import axios from "axios";


const getMonthlyJoined = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/monthly-member', { withCredentials: true });
        console.log(response.data); // Debugging
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly joined members:", error);
        return [];
    }
}
export {getMonthlyJoined};