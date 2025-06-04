import axios from "axios";


const getMonthlyJoined = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/monthly-member', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly joined members:", error);
        return [];
    }
}

const threeDayExpire = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/within-3-days-expiring', { withCredentials: true });
        console.log(response.data); // Debugging
        return response.data;
    } catch (error) {
        console.error("Error fetching members expiring in 3 days:", error);
        return [];
    }   
} 

export {threeDayExpire};
export {getMonthlyJoined};