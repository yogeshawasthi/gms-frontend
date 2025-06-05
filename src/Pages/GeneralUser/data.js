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
        return response.data;
    } catch (error) {
        console.error("Error fetching members expiring in 3 days:", error);
        return [];
    }   
} 

const fourToSevenDaysExpire = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/within-4-7-expiring', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching members expiring in 3 days:", error);
        return [];
    }   
} 

const expired = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/expired-member', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching members expiring in 3 days:", error);
        return [];
    }   
} 

const inActiveMember = async () => {
    try {
        const response = await axios.get('http://localhost:4000/members/inactive-member', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching members expiring in 3 days:", error);
        return [];
    }   
} 

export {getMonthlyJoined,threeDayExpire,fourToSevenDaysExpire,expired,inActiveMember};