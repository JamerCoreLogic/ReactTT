import axios from "axios";

const baseurl = "https://nettime.azurewebsites.net/api";

const apiServices = {
    getProjectTaskStatus: (data) => {
        const apiUrl = `${baseurl}/ProjectTask/GetTaskStatusByProjectId?ProjectId=`+data;
        return axios.get(apiUrl);
    },
    getProjectOverdueWorkItems: (data) => {
        const apiUrl = `${baseurl}/ProjectTask/GetByProjectId?ProjectId=`+data;
        return axios.get(apiUrl);
    },
    getProjectList: () => {
        const apiUrl = `${baseurl}/Project/GetProjects`;
        return axios.get(apiUrl);
    },
    getSortedProjectList: (data) => {
        const apiUrl = `${baseurl}/Project/GetProjects?PageNumber=${data.PageNumber}&PageSize=${data.PageSize}&OrderType=${data.OrderType}&ColumnName=${data.ColumnName}`;
        return axios.get(apiUrl);
    },
    getTaskList: () => {
        const apiUrl = `${baseurl}/ProjectTask/GetProjectTasks`;
        return axios.get(apiUrl);
    },
    getStatusList: () => {
        const apiUrl = `${baseurl}/Master/GetGenericMasterTable?type=Status`;
        return axios.get(apiUrl);
    },
    getPriorityList: () => {
        const apiUrl = `${baseurl}/Master/GetGenericMasterTable?type=Priority`;
        return axios.get(apiUrl);
    },
    getTaskTagList: () => {
        const apiUrl = `${baseurl}/Master/GetGenericMasterTable?type=TaskTag`;
        return axios.get(apiUrl);
    },
    getUserList: () => {
        const apiUrl = `${baseurl}/User/GetUsers`;
        return axios.get(apiUrl);
    },
    getFlagList: () => {
        const apiUrl = `${baseurl}/Master/GetGenericMasterTable?type=flag`;
        return axios.get(apiUrl);
    },
    getMilestoneList: () => {
        const apiUrl = `${baseurl}/Milestone/GetMilestones`;
        return axios.get(apiUrl);
    },
    getGroupList: () => {
        const apiUrl = `${baseurl}/Master/GetGenericMasterTable?type=group`;
        return axios.get(apiUrl);
    },
    getClientList: () => {
        const apiUrl = `${baseurl}/Client/GetClients`;
        return axios.get(apiUrl);
    },

    createClient: (data) => {
        const apiUrl = `${baseurl}/Client/Create`;
        return axios.post(apiUrl, data);
    },

    updateClient: (data) => {
        debugger
        const apiUrl = `${baseurl}/Client/Update`;
        return axios.post(apiUrl, data);
    },

    getTimesheetList:  () => {
        const apiUrl = `${baseurl}/Timesheet/GetTimesheets`;
        return axios.get(apiUrl);
      },
      getTaskListByProject: (data) => {
        const projectIdTask = data;
        const apiUrl = `${baseurl}/ProjectTask/GetByProjectId?ProjectId=`+ projectIdTask;
        return axios.get(apiUrl,data);
      },
      getTimesheetListByDate: (date) => {
        const apiUrl = `${baseurl}/DailyLog/GetTimesheetsByDate?TimesheetDate=${date}&OwnerId=6e646d05-862b-4651-aa8b-2bb56cc31c0c`;
        return axios.get(apiUrl);
      },
       getEventList: () => {
        const apiUrl = `${baseurl}/DailyLog/GetTimeByMonth?OwnerId=6e646d05-862b-4651-aa8b-2bb56cc31c0c`;
        return axios.get(apiUrl);
      },
    updateTask: (data) => {
        const apiUrl = `${baseurl}/ProjectTask/Update`;
        return axios.post(apiUrl, data);
    },
    createTask: (data) => {
        const apiUrl = `${baseurl}/ProjectTask/Create`;
        return axios.post(apiUrl, data);
    },
    updateMilestone: (data) => {
        const apiUrl = `${baseurl}/Milestone/Update`;
        return axios.post(apiUrl, data);
    },
    createMilestone: (data) => {
        const apiUrl = `${baseurl}/Milestone/Create`;
        return axios.post(apiUrl, data);
    },
    updateProject: (data) => {
        const apiUrl = `${baseurl}/Project/Update`;
        return axios.post(apiUrl, data);
    },
    createProject: (data) => {
        const apiUrl = `${baseurl}/Project/Create`;
        return axios.post(apiUrl, data);
    },
     updateTimeSheet: (data) => {
        const apiUrl = `${baseurl}/Timesheet/Update`;
        return axios.post(apiUrl, data);
      },
     createTimeSheet: (data) => {
        const apiUrl = `${baseurl}/Timesheet/Create`;
        return axios.post(apiUrl,data);
      }
  


}
export default apiServices