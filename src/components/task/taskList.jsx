import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';                                                             
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-enterprise';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import { ModuleRegistry } from '@ag-grid-community/core';
import AddTaskForm from './addTaskForm';
import ProgressBar from 'react-bootstrap/ProgressBar';
import apiServices from '../../services/service';
import Loader from '../common/Loader';

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const initialValue = {
    // id: '',
    displayName: '',
    name: '',
    projectId: '',
    description: '',
    // taskListId : '',
    statusId: '',
    associatedTeam: '',
    associatedTeamId: '',
    userId: '',
    workHours: 0,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    priorityId: '',
    taskTagId: '',
    // timeLogTotal : '',
    // percentageCompleted : '',
    // completionDate : '',
    // difference : '',
    billableStatus: '',
    // tag : '',
    // reminder : '',
    // recurrence : '',
    billableType: '',
}

const OptionButton = ({ rowData, handleClickOpenEditForm, handleClickOpenEditForm1, handleClickDelete, paramsValue }) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        handleClickDelete(rowData);
        setShowConfirmation(false);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    return (
        <div className='action-menu'>
            <i
                className="bi bi-pencil-square icon"
                onClick={() => handleClickOpenEditForm(paramsValue)}
                title="Edit Time Log"
            ></i>
            <i
                className="bi bi-trash icon"
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={handleDeleteClick}
                title="Delete Time Log"
            ></i>
            <i className="bi bi-info-circle icon"
                title="Details"></i>
        </div>
    );
};



function Task() {
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState();
    const [open, setOpen] = React.useState(false)
    const [projectListDropDown, setProjectListDropDown] = useState([])
    const [statusDropDown, setStatusDropDown] = useState([])
    const [priorityListDropDown, setPriorityListDropDown] = useState([])
    const [taskTagDropDown, setTaskTagDropDown] = useState([])
    //This state is used to update useEffect flag
    const [isGetList, setIsGetList] = useState(true)
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const [selectedTheme, setSelectedTheme] = useState('alpine');
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [taskData, setTaskData] = useState();
    const [buttontype, setbuttontype] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateListFlag, setUpdateListFlag] = useState(false);
    const [user, setUser] = useState();

    const dateFormatter = (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US'); // Adjust the locale as needed
    };

    const progressBarRenderer = (params) => {
        // Use HTML tags in the returned string
        return <ProgressBar variant="success" now={params.value} label={`${params.value}%`} />;
    };


    const filterParams = {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            const filterDateParts = filterLocalDateAtMidnight.toISOString().split('T')[0].split('-');
            const cellDateParts = cellValue.split(/[\/-]/);

            if (filterDateParts.length === 3 && cellDateParts.length === 3) {
                const filterYear = parseInt(filterDateParts[0]);
                const filterMonth = parseInt(filterDateParts[1]) - 1;
                const filterDay = parseInt(filterDateParts[2]) + 1;

                const cellYear = parseInt(cellDateParts[0]);
                const cellMonth = parseInt(cellDateParts[1]) - 1;
                const cellDay = parseInt(cellDateParts[2]);

                const filterDate = new Date(filterYear, filterMonth, filterDay);
                const cellDate = new Date(cellYear, cellMonth, cellDay);

                if (filterDate.getTime() === cellDate.getTime()) {
                    return 0;
                }

                if (cellDate < filterDate) {
                    return -1;
                }

                if (cellDate > filterDate) {
                    return 1;
                }
            }

            return 0;
        },
        minValidYear: 2000,
        maxValidYear: 2024,
        inRangeFloatingFilterDateFormat: 'DD MMM YYYY',
        buttons: ['apply', 'reset'],
        closeOnApply: true,
    };


    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Actions',
            cellRenderer: (params) => {
                const paramsValue = { ...params.data };
                return <OptionButton rowData={paramsValue} openPopup={open} handleClickOpenEditForm={() => handleClickOpenEditForm(paramsValue)} />;
            },
            maxWidth: 100,
            sortable: false,
            filter: false,
        },
        {
            headerName: 'Task',
            field: 'displayName',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },

        {
            headerName: 'Project',
            field: 'project',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },

        {
            headerName: 'Owner',
            field: 'userName',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        {
            headerName: 'Status',
            field: 'status',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
            cellRenderer: (params) => {
                let className = null;

                if (params.value === 'Completed') {
                    className = 'completed status-tags';
                } else if (params.value === 'Active' || params.value === 'In Progress') {
                    className = 'active status-tags';
                }
                else if (params.value === 'OnHold') {
                    className = 'hold status-tags';
                }
                else if (params.value === 'Reopen') {
                    className = 'reopen status-tags';
                } else if (params.value === 'Cancelled') {
                    className = 'cancelled status-tags';
                }
                else if (params.value === 'Deferred') {
                    className = 'deferred status-tags';
                }
                else if (params.value !== '' && params.value !== null) {
                    // Handle other cases or set a default class if needed
                    className = 'default status-tags';
                }

                return <span className={className}>{params.value}</span>;
            },

        },

        // {
        //     headerName: 'Description',
        //     field: 'description',
        //     filter: 'agTextColumnFilter',
        //     filterParams: {
        //         buttons: ['apply', 'reset'],
        //         closeOnApply: true,
        //     },
        // },

        {
            headerName: 'Task Tag',
            field: 'taskTag',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },

        // {
        //     headerName: 'Associated Team',
        //     field: 'associatedTeam',
        //     filter: 'agTextColumnFilter',
        //     filterParams: {
        //         buttons: ['apply', 'reset'],
        //         closeOnApply: true,
        //     },
        // },
        {
            headerName: 'Start Date',
            field: 'startDate',
            filter: 'agDateColumnFilter',
            valueFormatter: dateFormatter,
            filterParams: filterParams
        },

        {
            headerName: 'Due Date',
            field: 'dueDate',
            filter: 'agDateColumnFilter',
            valueFormatter: dateFormatter,
            filterParams: filterParams

        },
        {
            headerName: 'Priority',
            field: 'priority',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        {
            headerName: '% Completed',
            field: 'percentageCompleted',
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
            cellRenderer: progressBarRenderer
        },

        {
            headerName: 'Completion Date',
            field: 'dueDate',
            filter: 'agDateColumnFilter',
            valueFormatter: dateFormatter,
            filterParams: filterParams
        },


        {
            headerName: 'Work Hours',
            field: 'workHours',
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        //   {
        //         headerName: 'Timelog Total (T)',
        //         field: 'timeLogTotal',
        //         filter: 'agNumberColumnFilter',
        //         filterParams: {
        //             buttons: ['apply', 'reset'],
        //             closeOnApply: true,
        //         },
        //     },

        // {
        //     headerName: 'Difference (P-T)',
        //     field: 'difference',
        //     filter: 'agNumberColumnFilter',
        //     filterParams: {
        //         buttons: ['apply', 'reset'],
        //         closeOnApply: true,
        //     }
        // },
        {
            headerName: 'Billing Type',
            field: 'billableType',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },

        {
            headerName: 'Billable Status',
            field: 'billableStatus',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        // {
        //     headerName: 'Tags',
        //     field: 'tag',
        //     filter: 'agTextColumnFilter',
        //     filterParams: {
        //         buttons: ['apply', 'reset'],
        //         closeOnApply: true,
        //     },
        // },
        // {
        //     headerName: 'Reminder',
        //     field: 'reminder',
        // },
        // {
        //     headerName: 'Recurrence',
        //     field: 'recurrence',
        // },
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        editable: true,
        flex: 1,
        minWidth: 150,
        filter: true,
        resizable: false,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true,
    }));
    const statusBar = useMemo(() => {
        return {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ],
        };
    }, []);
    const cellClickedListener = useCallback(event => {
    }, []);
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);
    const popupParent = useMemo(() => {
        return document.body;
    }, []);
    const paginationNumberFormatter = useCallback((params) => {
        return '[' + params.value.toLocaleString() + ']';
    }, []);
    const onFirstDataRendered = useCallback((params) => {
        gridRef.current.api.paginationGoToPage();
    }, []);
    const onPageSizeChanged = useCallback(() => {
        //setIsLimitLoading(true);
        var value = document.getElementById('page-size').value;
        // setLimit(value);
        gridRef.current.api.paginationSetPageSize(Number(value));
    }, []);
    const sortingOrder = useMemo(() => {
        return ['desc', 'asc', null];
    }, []);
    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);
    const handleThemeChange = (event) => {
        setSelectedTheme(event.target.value);
    };
    //method for filter on groups
    const autoGroupColumnDef = useMemo(() => {
        return {
            minWidth: 200,
            pinned: 'left',
        };
    }, []);


    const handleOpenAddForm = () => {
        setbuttontype('add');
        const updatedObject = {
            ...initialValue,
            type: 'add',
        };
        setTaskData(updatedObject);
        setOpen(true);
    }

    const handleClickOpenEditForm = (paramsValue) => {
        setbuttontype('edit');
        const updatedObject = {
            ...paramsValue,
            type: 'edit',
        };
        setTaskData(updatedObject);
        setOpen(true);
    };
    const handleCloseAddForm = () => {
        setOpen(false)
    };

    useEffect(() => {
        if (isGetList) {
            apiServices.getProjectList()
                .then((response) => {
                    if (response.status === 200) {
                        const projectListDropDown = response.data.projectList;
                        setIsGetList(false)
                        setProjectListDropDown(projectListDropDown);
                    }
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    }, [isGetList])


    useEffect(() => {
        if (isGetList) {
            apiServices.getStatusList()
                .then((response) => {
                    if (response.status === 200) {
                        const StatusDropDown = response.data;
                        setIsGetList(false)
                        setStatusDropDown(StatusDropDown);
                    }
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    }, [isGetList])



    useEffect(() => {
        if (isGetList) {
            apiServices.getPriorityList()
                .then((response) => {
                    if (response.status === 200) {
                        const priorityDropDown = response.data;
                        setIsGetList(false)
                        setPriorityListDropDown(priorityDropDown);
                    }
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    }, [isGetList])


    useEffect(() => {
        if (isGetList) {
            apiServices.getTaskTagList()
                .then((response) => {
                    if (response.status === 200) {
                        const taskTagDropDown = response.data;
                        setIsGetList(false)
                        setTaskTagDropDown(taskTagDropDown);
                    }
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    }, [isGetList])

    useEffect(() => {
        if (isGetList) {
            {
                apiServices.getUserList()
                    .then((response) => {
                        if (response.status === 200) {
                            setUser(response.data.userList);
                            setIsGetList(false)
                            setLoading(false)
                        } else {
                            // Handle other status codes here
                            toast.error(`An unexpected error occurred: ${response.status}`, { position: toast.POSITION.TOP_RIGHT });

                            // Display an error alert for unexpected status codes
                            // alert("Unexpected error");
                        }
                    })
                    .catch((error) => {
                        // Handle errors
                        console.error("Error uploading file:", error);
                        //toast.error('An unexpected error occurred.', { position: toast.POSITION.TOP_RIGHT });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    }, [isGetList]);

    useEffect(() => {
        if (updateListFlag || isGetList) {
            setLoading(true);
            apiServices
                .getTaskList()
                .then((response) => {
                    if (response.status === 200) {
                        const taskList = response.data.projectTasks;
                        setUpdateListFlag(false)
                        setRowData(taskList);
                        setUpdateListFlag(false)
                        setIsGetList(false)
                        setLoading(false)
                    } else {
                        // Handle other status codes here
                        toast.error(`An unexpected error occurred: ${response.status}`, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setLoading(false);
                        // Display an error alert for unexpected status codes
                        // alert("Unexpected error");
                    }
                })
                .catch((error) => {
                    setLoading(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [updateListFlag,isGetList]);



    const handleFormSubmit = (formData) => {
        setLoading(true)
        if (formData.type === 'edit') {
            const newObj = {...formData };
            delete newObj.type;
            delete newObj.flagName;
            delete newObj.customFields;
            apiServices.updateTask(newObj)
                .then((response) => {
                    if (response.status === 200) {
                        setOpen(false);
                        setUpdateListFlag(true);
                        toast.success('Task updated successfully!', { position: toast.POSITION.TOP_RIGHT });
                        //setLoading(false)
                    } else {
                        const errorMessages = [];
                        setOpen(false);
                        setLoading(false)
                        for (const key in response.errors) {
                            if (response.errors.hasOwnProperty(key)) {
                                const messages = response.errors[key];
                                errorMessages.push(...messages);
                            }
                            
                        }
                        errorMessages.forEach(errorMessage => {
                            toast.error(errorMessage, { position: toast.POSITION.TOP_RIGHT });
                        });
                    }
                    // else {
                    //   // Handle other error cases
                    //   toast.error('An error occurred while submitting the form.', { position: toast.POSITION.TOP_RIGHT });
                    // }
                })
                .catch((error) => {
                    setLoading(false)
                    if (error.response && error.response.data && error.response.data.errors) {
                        const errors = error.response.data.errors;
                        // Extract HTTP status code
                        const status = error.response.status;

                        // Loop through each error type (e.g., "EndDate") and display its messages
                        Object.keys(errors).forEach((errorType) => {
                            const errorMessages = errors[errorType];
                            errorMessages.forEach((errorMessage) => {
                                // Display each error message in the toaster
                                toast.error(`Status ${status}: ${errorMessage}`, { position: toast.POSITION.TOP_RIGHT });
                            });
                        });
                    } else {
                        // If there are no specific error messages, show a generic error
                        toast.error(`${error.response.status} An unexpected error occurred`, { position: toast.POSITION.TOP_RIGHT });
                    }
                });
        }
        else {
            const newObj1 = { ...formData };
            delete newObj1.type;
            delete newObj1.flagName;
            apiServices.createTask(newObj1)
                .then((response) => {
                    if (response.status === 200) {
                        setOpen(false);
                        setUpdateListFlag(true);
                        toast.success('Task created successfully!', { position: toast.POSITION.TOP_RIGHT });
                        // setLoading(false)
                    } else {
                        setOpen(false);
                        setLoading(false)
                        const errorMessages = [];
                        for (const key in response.errors) {
                            if (response.errors.hasOwnProperty(key)) {
                                const messages = response.errors[key];
                                errorMessages.push(...messages);
                            }
                        }
                        errorMessages.forEach(errorMessage => {
                            toast.error(errorMessage, { position: toast.POSITION.TOP_RIGHT });
                        });
                    }
                    // else {
                    //   // Handle other error cases
                    //   toast.error('An error occurred while submitting the form.', { position: toast.POSITION.TOP_RIGHT });
                    // }
                })
                .catch((error) => {
                    //setOpen(false);
                    setLoading(false)
                    if (error.response && error.response.data && error.response.data.errors) {
                        const errors = error.response.data.errors;
                        // Extract HTTP status code
                        const status = error.response.status;

                        // Loop through each error type (e.g., "EndDate") and display its messages
                        Object.keys(errors).forEach((errorType) => {
                            const errorMessages = errors[errorType];
                            errorMessages.forEach((errorMessage) => {
                                // Display each error message in the toaster
                                toast.error(`Status ${status}: ${errorMessage}`, { position: toast.POSITION.TOP_RIGHT });
                            });
                        });
                    } else {
                        // If there are no specific error messages, show a generic error
                        toast.error(`${error.response.status} An unexpected error occurred`, { position: toast.POSITION.TOP_RIGHT });
                    }
                });

        }
    }


    return (
        <> {loading && <Loader />}
            <div style={containerStyle}>
                <ToastContainer />
                <div className="main-hd">
                    <div className="pagetitle">
                    </div>

                    <div className="third-div">
                        <div className="heading_item">
                            <input className="form-control" id="filter-text-box" type="Text" placeholder="Search in Tasks..."
                                onInput={onFilterTextBoxChanged} />
                        </div>
                        <div className="heading_item select_optn">
                            <label>
                                Theme Change:
                            </label>
                            <select className='select-div' value={selectedTheme} onChange={handleThemeChange}>
                                <option value="alpine">Alpine</option>
                                <option value="balham">Balham</option>
                                <option value="material">Material</option>
                            </select>
                        </div>

                        <div className="heading_item">
                            <button className="add-btn" type="button" onClick={handleOpenAddForm}>
                                New Task
                            </button>
                            {open && user && user.length > 0 && (<div className={`overlay ${isOverlayVisible ? 'visible' : ''}`}> <AddTaskForm handleCloseAddForm={handleCloseAddForm} handleFormSubmit={handleFormSubmit} handleClickOpenEditForm={handleClickOpenEditForm} priorityListDropDown={priorityListDropDown}
                                projectListDropDown={projectListDropDown} statusDropDown={statusDropDown} taskData={taskData} taskTagDropDown={taskTagDropDown} user={user} open={open} /> </div>)}
                        </div>

                    </div>
                </div>
                <div className={`ag-theme-${selectedTheme} tbl_height`} style={{ width: '100%', height: `100%`, }}>
                    {(loading) ? (
                        <Loader />
                    ) : (
                        <AgGridReact
                            domLayout="autoHeight"
                            ref={gridRef} // Ref for accessing Grid's API
                            rowData={rowData} // Row Data for Row
                            columnDefs={columnDefs}
                            autoGroupColumnDef={autoGroupColumnDef}
                            defaultColDef={defaultColDef} // Default Column Properties
                            overlayLoadingTemplate={
                                `<Loader />`
                            }
                            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                            rowSelection={'multiple'} // Options - allows click selection of rows
                            statusBar={statusBar}
                            enableRangeSelection={true}
                            suppressExcelExport={true}
                            suppressRowClickSelection={true}
                            groupSelectsChildren={true}
                            pivotPanelShow={'always'}
                            popupParent={popupParent}
                            sortingOrder={sortingOrder}
                            onFirstDataRendered={onFirstDataRendered}
                            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                            rowDragManaged={true}
                            suppressMoveWhenRowDragging={true} // to mange the design behaviour during the drag a column.
                        />

                    )}
                </div>

            </div>

        </>
    )
}

export default Task