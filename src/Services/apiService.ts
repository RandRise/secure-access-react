import axios from "axios";
import { registrationModel } from "../Models/registrationModel";
import { ICommonResponse } from "../Common/commonInterfaces";
import { confirmationModel } from "../Models/confirmationModel";
import { userLoginModel } from "../Models/userLoginModel";
import { AddEmployeeModel } from "../Models/AddEmployeeModel";
import { EmployeeModel } from "../Models/employeeModel";

const baseURL = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api';


const registerAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Auth/register';
const confirmAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Auth/confirm-email';
const resendVerificationCodeAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Auth/resend-confirm-code';
const userLoginAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Auth/login';
const refreshTokenAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Auth/refresh-token';
const getEmployeesAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Employee/Employees';
const addEmployeeAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Employee/AddEmployee';
const deleteEmployeeAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Employee/DeleteEmployee';
const updateEmployeeAPI = 'https://task-follow-up.v2202305135856227727.ultrasrv.de/api/Employee/UpdateEmployee';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: "Bearer " + localStorage.getItem('Token')
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('Token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            window.location.href = '/login';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('RefreshToken');
                const refreshResponse = await axios.post(refreshTokenAPI, { refreshToken: refreshToken });
                const newToken = refreshResponse.data.Data.Token;
                const newRefreshToken = refreshResponse.data.Data.RefreshToken;

                localStorage.setItem('Token', newToken);
                localStorage.setItem('RefreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axios(originalRequest);
            } catch (error) {

            }
            return Promise.reject(error);
        }
    }
);

export class Authentication {
    static registerUserAPI = async (formData: registrationModel): Promise<ICommonResponse> => {
        try {
            const response = await axios.post(registerAPI, formData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data ?? error.message;
        }
    }

    static confirmUserAPI = async (formData: confirmationModel): Promise<ICommonResponse> => {
        try {
            const response = await axios.post(confirmAPI, formData);
            return response.data;
        } catch (error: any) {

            throw error.response?.data ?? error.message;

        }
    }
    static resendVerificationCodeAPI = async (formData: registrationModel): Promise<ICommonResponse> => {
        try {
            const response = await axios.post(resendVerificationCodeAPI, { email: formData });
            return response.data;
        } catch (error: any) {
            throw error.response?.data ?? error.message;
        }
    }

    static loginAPI = async (formData: userLoginModel): Promise<ICommonResponse> => {
        try {
            const response = await axios.post(userLoginAPI, formData);

            const Token = response.data.Data.Token;
            const RefreshToken = response.data.Data.RefreshToken;

            localStorage.setItem('Token', Token);
            localStorage.setItem('RefreshToken', RefreshToken);

            api.defaults.headers.common['Authorization'] = `Bearer ${Token}`;
            return response.data;

        } catch (error: any) {

            throw error;
        }
    }
}
export class EmployeeServices {
    static getEmployeesAPI = async (): Promise<ICommonResponse> => {
        try {
            const response = await api.get(getEmployeesAPI);
            return response.data;
        } catch (error: any) {

            throw error.response?.data ?? error.message;
        }
    }

    static addEmployee = async (formData: AddEmployeeModel): Promise<ICommonResponse> => {
        try {
            const response = await api.post(addEmployeeAPI, formData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data ?? error.message;
        }
    }

    static deleteEmployee = async (Id: number): Promise<ICommonResponse> => {
        try {
            const response = await api.post(deleteEmployeeAPI, { Id });
            return response.data;
        } catch (error: any) {
            throw error.response?.data ?? error.message;
        }
    }

    static updateEmployee = async (formData: EmployeeModel): Promise<ICommonResponse> => {
        try {
          
            const response = await api.post(updateEmployeeAPI, formData);
            console.log("API SERVICE ",response)

            return response.data;
        } catch (error: any) {
            throw error.response?.data ?? error.message;
        }
    };


}