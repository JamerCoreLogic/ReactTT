import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Dropdown } from "react-bootstrap";


const validationSchema = Yup.object().shape({
  projectId: Yup.string().required('Project is required, Please select a project'),
  displayName: Yup.string().required('Task is required'),
  description: Yup.string().required('Description is required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date format').max(Yup.ref('dueDate'), 'Start date must be before Due date'),
  dueDate: Yup.date().required('Due date is required').typeError('Invalid date format').min(Yup.ref('startDate'), 'Due date must be after Start date'),
  workHours: Yup.string().required('Daily Work Hour (Hours) is required').min(0, 'Minimum value is 0 hours'),//.max(24, 'Maximum value is 24 hours'),
  billableType: Yup.string().required('Billing Type is required, Please select a type'),
  billableStatus: Yup.string().required('Billable Status is required, Please select a status'),
  priorityId: Yup.string().required('Priority is required, Please select one'),
  taskTagId: Yup.string().required('Task Tag is required, Please select one'),
  userId: Yup.string().required('Owner is required, Please select one'),
  statusId: Yup.string().required('Status is required, Please select one'),
});


const AddTaskForm = ({ handleCloseAddForm, timeSheetData,open, taskTagDropDown, user, handleFormSubmit, projectListDropDown, priorityListDropDown,statusDropDown, taskData }) => {
  const [selectedProjectName, setselectedProjectName] = useState(timeSheetData ? timeSheetData.projectName : '');
  const [SelectedProjectId, setSelectedProjectId] = useState('');
  const [formData, setFormData] = useState(taskData);
  const [errormsg, setErrorMsg] = useState({});
  const [currentDate, setCurrentDate] = useState('');
  const [OwnerList, setOwnerList] = useState(user);

  useEffect(() => {
    // Set the current date in the format "YYYY-MM-DD"
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);


  const handleDropDownChange = (selectedId, e, name) => {
    debugger
    const selectedValue = e.currentTarget.textContent;
    setErrorMsg((prevErrorMsg) => ({
      ...prevErrorMsg,
      [name]: undefined,
    }));
    if (name === 'projectName') {
      setFormData({
        ...formData,
        projectId: selectedId,
        project: selectedValue,
      });
      setSelectedProjectId(selectedId);
      setselectedProjectName(selectedValue);
    }
    else if (name === 'priority') {
      setFormData({
        ...formData,
        priorityId: selectedId,
        priority: selectedValue,
      });
    }
    else if (name === 'taskTag') {
      setFormData({
        ...formData,
        taskTagId: selectedId,
        taskTag: selectedValue,
      });
    }
    else if (name === 'billableType') {
      setFormData({
        ...formData,
        billableType: selectedValue,
      });
    }
    else if (name === 'billableStatus') {
      setFormData({
        ...formData,
        billableStatus: selectedValue,
      });
    }
    else if (name === 'owner') {
      setFormData({
        ...formData,
        userId: selectedId,
        userName: selectedValue,
      });
    }
    else if (name === 'status') {
      setFormData({
        ...formData,
        statusId: selectedId,
        status: selectedValue,
      });
    }
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setErrorMsg((prevErrorMsg) => ({
      ...prevErrorMsg,
      [name]: undefined,
    }));
    const convertedValue = (name === 'startDate' || name === 'dueDate') ? new Date(value).toISOString() : value;

    setFormData({
      ...formData,
      [name]: convertedValue,
    });
  };

  const handleSubmit = async (formData) => {
    debugger
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      formData.name = formData.displayName
       formData.workHours = parseFloat(formData.workHours);
    
      if (taskData && taskData.type === 'edit') {
        handleFormSubmit(formData);
      } else {
        handleFormSubmit(formData);
      }
    }
    catch (error) {
      const fieldErrors = {};
      error.inner.forEach((err) => {
        fieldErrors[err.path] = err.message;
      });
      setErrorMsg(fieldErrors);
      console.error("Validation Error:", fieldErrors);
    }
  };


  return (
    <>
      <div className={`modal fade ${open ? 'show' : ''}`} id="accountModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: open ? 'flex' : 'none', justifyContent: 'flex-end' }}>
        <div className="modal-dialog" style={{ width: "600px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-5" id="exampleModalLabel" >
                {taskData.type === 'add' ? 'New Task' : 'Update Task'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseAddForm}></button>
            </div>
            <div className="modal-body">
              <Formik initialValues={formData} onSubmit={(values) => handleSubmit(values)} validationSchema={validationSchema} >
                <Form>
                  <div className="form">
                    <div className='input-container'>
                      <label htmlFor="project">Project<span className="required-star">*</span></label>
                      <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'projectName')}>
                        <Dropdown.Toggle variant="success" name="projectName"
                          id="dropdown-basic">
                          {formData.project || 'Select Project'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {projectListDropDown.map((data) => (
                            <Dropdown.Item
                              key={data.id}
                              // value={data.value}
                              eventKey={data.id}
                            >
                              {data.displayName}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      {errormsg.projectId && <div className="error-message">{errormsg.projectId}</div>}
                    </div>
                    <>
                      <div className='input-container'>
                        <label htmlFor="firstName">Task<span className="required-star">*</span></label>
                        <Field className="formik-input"
                          required
                          type="text"
                          name="displayName"
                          id="displayName"
                          variant="outlined"
                          value={formData.displayName}
                          onChange={handleChangeForm}
                        />
                        {errormsg.displayName && <div className="error-message">{errormsg.displayName}</div>}
                      </div>

                      <div className="input-container">
                        <label htmlFor="firstName">Task Tag<span className="required-star">*</span></label>
                        <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'taskTag')}>
                          <Dropdown.Toggle variant="success" name="taskTag" id="dropdown-basic">
                            {formData.taskTag || 'Select Task Tag'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {taskTagDropDown.map((data) => (
                              <Dropdown.Item
                                key={data.id}
                                // value={data.value}
                                eventKey={data.id}
                              >
                                {data.displayName}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        {errormsg.taskTag && <div className="error-message">{errormsg.taskTag}</div>}
                      </div>
                      <div className="input-container">
                        <label htmlFor="firstName">Description<span className="required-star">*</span></label>
                        <Field className="formik-input"
                          required
                          as="textarea"
                          type="text"
                          name="description"
                          id="description"
                          fullWidth
                          autoComplete="given-name"
                          variant="outlined"
                          value={formData.description}
                          onChange={handleChangeForm}
                        />
                        {errormsg.description && <div className="error-message">{errormsg.description}</div>}
                      </div>
                      <div className="form-links">Task Information</div>
                      <div className="input-container">
                        <label htmlFor="firstName">Owner<span className="required-star">*</span></label>
                        <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'owner')}>
                          <Dropdown.Toggle variant="success" name="userId"
                            id="dropdown-basic">
                            {formData.userName || 'Select Owner'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {OwnerList.map((data) => (
                              <Dropdown.Item
                                key={data.userId}
                                // value={data.value}  
                                eventKey={data.userId} >
                                {data.display_name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        {errormsg.userId && <div className="error-message">{errormsg.userId}</div>}
                      </div>
                      <div className='input-container'>
                      <label htmlFor="status">Status<span className="required-star">*</span></label>
                      <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'status')}>
                        <Dropdown.Toggle variant="success" name="status"
                          id="dropdown-basic">
                          {formData.status || 'Select Status'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {statusDropDown.map((data) => (
                            <Dropdown.Item
                              key={data.id}
                              // value={data.value}
                              eventKey={data.id}
                            >
                              {data.displayName}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      {errormsg.statusId && <div className="error-message">{errormsg.statusId}</div>}
                    </div>

                      <div className="input-container">
                        <label htmlFor="firstName">Work Hours<span className="required-star">*</span></label>
                        <Field className="formik-input"
                          type="text"
                          name="workHours"
                          id="workHours"
                          fullWidth
                          autoComplete="given-name"
                          variant="outlined"
                          value={formData.workHours}
                          onChange={handleChangeForm}
                        />
                        {errormsg.workHours && <div className="error-message">{errormsg.workHours}</div>}
                      </div>
                      <div className="two-inputs1">
                        <div className="input-container">
                          <label htmlFor="firstName">Start Date<span className="required-star">*</span></label>
                          <Field className="formik-input"
                            required
                            type="date"
                            name="startDate"
                            // label="Start Date"
                            id="startDate"
                            fullWidth
                            autoComplete="given-name"
                            variant="outlined"
                            min={new Date().toISOString().split('T')[0]}
                            value={(formData.startDate ? formData.startDate.substring(0, 10) : '') || currentDate}
                            onChange={handleChangeForm}
                          />
                          {/* {errormsg.startDate && <div className="error-message">{errormsg.startDate}</div>} */}
                        </div>
                        <div className="input-container">
                          <label htmlFor="firstName">Due Date<span className="required-star">*</span></label>
                          <Field className="formik-input"
                            type="date"
                            name="dueDate"
                            // label="Due Date"
                            id="dueDate"
                            fullWidth
                            autoComplete="given-name"
                            variant="outlined"
                            min={new Date().toISOString().split('T')[0]}
                            value={(formData.dueDate ? formData.dueDate.substring(0, 10) : '') || currentDate}
                            onChange={handleChangeForm}
                          />
                          {(errormsg.startDate && errormsg.dueDate) && <div className="error-message">{errormsg.dueDate}</div>}
                        </div>
                      </div>

                      <div className="two-inputs1">
                        <div className="input-container">
                          <label htmlFor="firstName">Priority<span className="required-star">*</span></label>
                          <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'priority')}>
                            <Dropdown.Toggle variant="success" name="priority" id="dropdown-basic">
                              {formData.priority || 'Select Priority'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {priorityListDropDown.map((data) => (
                                <Dropdown.Item
                                  key={data.id}
                                  // value={data.value}
                                  eventKey={data.id}
                                >
                                  {data.displayName}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          {errormsg.priority && <div className="error-message">{errormsg.priority}</div>}
                        </div>
                        <div className="input-container">
                          <label htmlFor="firstName">Billing Status<span className="required-star">*</span></label>
                          <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'billableStatus')}>
                            <Dropdown.Toggle variant="success" name="billableStatus" id="dropdown-basic">
                              {formData.billableStatus || 'Select Billable Status'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="Billable">Billable</Dropdown.Item>
                              <Dropdown.Item eventKey="Non-Billable">Non-Billable</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          {errormsg.billableStatus && <div className="error-message">{errormsg.billableStatus}</div>}
                        </div>
                      </div>

                      {/* <div className="input-container">
                        <label htmlFor="firstName">Tags<span className="required-star">*</span></label>
                        <Field className="formik-input"
                          type="text"
                          name="tag"
                          id="tag"
                          fullWidth
                          autoComplete="given-name"
                          variant="outlined"
                          value={formData.tag}
                          onChange={handleChangeForm}
                        />
                        {errormsg.tag && <div className="error-message">{errormsg.tag}</div>}
                      </div> */}
                      <div className="input-container">
                        <label htmlFor="firstName">Billing Type<span className="required-star">*</span></label>
                        <Dropdown onSelect={(val, e) => handleDropDownChange(val, e, 'billableType')}>
                          <Dropdown.Toggle variant="success" name="billableType" id="dropdown-basic">
                            {formData.billableType || 'Select Billing Type'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="None">None</Dropdown.Item>
                            <Dropdown.Item eventKey="Billable">Billable</Dropdown.Item>
                            <Dropdown.Item eventKey="Non-Billable">Non-Billable</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {errormsg.billableType && <div className="error-message">{errormsg.billableType}</div>}
                      </div>
                    </>
                  </div>
                </Form>
              </Formik>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="formikform-savebutton"
                onClick={() => {
                  handleSubmit(formData);
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="formikform-cancelbutton"
                data-bs-dismiss="modal"
                onClick={handleCloseAddForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div></>
  )
}

export default AddTaskForm