import {FormEvent, useEffect, useState} from 'react'
import {IJob, NextPageWithLayout} from '@/types'
import {useAuth} from '@/hooks/useAuth'
import Head from 'next/head'
import Modal from '@/components/Modal'
import axios from '@/axios'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import toast from 'react-hot-toast'

const Jobs: NextPageWithLayout = () => {
    const {user} = useAuth()
    const [jobs, setJobs] = useState<IJob[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [role, setRole] = useState('')
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [filterTitle, setFilterTitle] = useState('')
    const [filterLocation, setFilterLocation] = useState('')
    const [filterRole, setFilterRole] = useState('')

    const getJobs = () => {
        axios.get('/api/jobs', {
            params: {title: filterTitle, location: filterLocation, role: filterRole}
        })
            .then(response => {
                setJobs(response.data)
            })
    }

    const removeJob = (id: string) => {
        axios.post('/api/removeJob', {jobId: id})
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.success)
                    getJobs()
                }
            })
    }

    const toggleCreateForm = () => {
        setShowCreateForm(prevState => !prevState)
    }

    const createJob = (e: FormEvent) => {
        e.preventDefault()

        setTitle('')
        setLocation('')
        setRole('')

        axios.post('/api/jobs', {title, location, role})
            .then(response => {
                getJobs()
            })
    }

    const applyFilters = () => {
        getJobs()
        setShowFilterModal(false)
    }

    useEffect(() => {
        getJobs()
    }, [])

    return (
        <>
            <Head>
                <title>Jobs</title>
            </Head>
            <Modal isOpen={showFilterModal} onRequestClose={() => setShowFilterModal(false)}>
                <form onSubmit={applyFilters}>
                    <div>
                        <label htmlFor="title">TITLE: </label>
                        <input id="title" type="text" value={filterTitle}
                               onChange={e => setFilterTitle(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="location">LOCATION: </label>
                        <input id="location" type="text" value={filterLocation}
                               onChange={e => setFilterLocation(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="role">ROLE: </label>
                        <input id="role" type="text" value={filterRole}
                               onChange={e => setFilterRole(e.target.value)}/>
                    </div>
                    <button className="btn" style={{width: '100%', marginTop: '20px'}}>Update</button>
                </form>
            </Modal>
            <div className="job-area">
                <div className="job-buttons">
                    {!!user.company && (
                        <>
                            <button onClick={toggleCreateForm} className="left-button">
                                Create a job advertisement
                                <i className="fa-solid fa-plus"></i>
                            </button>
                            <button onClick={() => setShowFilterModal(true)} className="right-button"><i
                                className="fa-solid fa-sort"></i> Filter
                            </button>
                        </>
                    )}
                </div>

                {showCreateForm && (
                    <form onSubmit={createJob}>
                        <div>
                            <input style={{width: '100%'}} type="text" placeholder="title" value={title}
                                   onChange={e => setTitle(e.target.value)}
                                   required/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <input style={{width: '100%'}} type="text" placeholder="location" value={location}
                                   onChange={e => setLocation(e.target.value)} required/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <input style={{width: '100%'}} type="text" placeholder="role" value={role}
                                   onChange={e => setRole(e.target.value)}
                                   required/>
                        </div>
                        <button className="btn" style={{marginTop: '10px', width: '100%'}}>Create</button>
                    </form>
                )}

                <div className="jobs">
                    {jobs.map(job => (
                        <div key={job._id} className="job" style={{position: 'relative'}}>
                            {job.user!._id === user._id && (
                                <div onClick={() => removeJob(job._id)}
                                     style={{position: 'absolute', top: 20, right: 20, cursor: 'pointer'}}>
                                    <i className="fa fa-x"></i>
                                </div>
                            )}
                            <div className="job-content-area">
                                <div className="job-content-area-profile">
                                    <Avatar user={job.user!} style={{color: 'unset'}}/>
                                </div>
                                <div className="job-content-area-content">
                                    <div className="job-content-name">
                                        {job.title}
                                    </div>
                                    <div className="job-location-and-role">
                                        <div className="job-content-area-2">
                                            <div className="job-heading">location:</div>
                                            <div className="job-content">{job.location}</div>
                                        </div>
                                        <div className="job-content-area-2">
                                            <div className="job-heading">role:</div>
                                            <div className="job-content">{job.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {job.user?.slug !== user.slug && (
                                <Link href={`/chat/${job.user?.slug}`} className="job-content-search"><i
                                    className="fa-solid fa-magnifying-glass"/></Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

Jobs.authorization = true

export default Jobs
