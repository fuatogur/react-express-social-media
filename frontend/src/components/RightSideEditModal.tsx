import {FormEvent, useState} from 'react'
import {useAuth} from '@/hooks/useAuth'
import {IUser} from '@/types'
import {nanoid} from 'nanoid'
import {useRouter} from 'next/router'
import Modal from './Modal'
import toast from 'react-hot-toast'
import axios from '@/axios'
// @ts-ignore
import omit from 'lodash/omit'

interface Props {
    isOpen: boolean
    onRequestClose: () => void
    user: IUser
}

const RightSideEditModal = ({user, isOpen, onRequestClose}: Props) => {
    const {login} = useAuth()
    const [about, setAbout] = useState(user.about)
    const [interest, setInterest] = useState('')
    const [interests, setInterests] = useState(user.interests)
    const [educationText, setEducationText] = useState('')
    const [educationDate, setEducationDate] = useState('')
    const [education, setEducation] = useState(user.education)
    const [skill, setSkill] = useState('')
    const [skills, setSkills] = useState(user.skills)
    const [experienceText, setExperienceText] = useState('')
    const [experienceDate, setExperienceDate] = useState('')
    const [experiences, setExperiences] = useState(user.experiences)
    const router = useRouter()

    const submit = (e: FormEvent) => {
        e.preventDefault()

        axios.post('/api/updateUserData', {
            about,
            interests: interests.map(interest => omit(interest, '_id')),
            education: education.map(education => omit(education, '_id')),
            skills: skills.map(skill => omit(skill, '_id')),
            experiences: experiences.map(experience => omit(experience, '_id'))
        }).then(response => {
            const data = response.data

            if (data.error) {
                toast.error(data.error)
            } else if (data.success) {
                toast.success(data.success.message)
                onRequestClose()
                login(data.success.token)
                router.reload()
            }
        })
    }

    const addInterest = (e: FormEvent) => {
        e.preventDefault()

        if (!interest) return

        // @ts-ignore
        setInterests([...interests, {_id: nanoid(), name: interest}])
        setInterest('')
    }

    const removeInterest = (id: string) => {
        setInterests(interests.filter(interest => interest._id !== id))
    }

    const addEducation = (e: FormEvent) => {
        e.preventDefault()

        if (!educationText) return

        // @ts-ignore
        setEducation([...education, {_id: nanoid(), name: educationText, date: educationDate}])
        setEducationText('')
    }

    const removeEducation = (id: string) => {
        setEducation(education.filter(education => education._id !== id))
    }

    const addSkill = (e: FormEvent) => {
        e.preventDefault()

        if (!skill) return

        // @ts-ignore
        setSkills([...skills, {_id: nanoid(), name: skill}])
        setSkill('')
    }

    const removeSkill = (id: string) => {
        setSkills(skills.filter(skill => skill._id !== id))
    }

    const addExperience = (e: FormEvent) => {
        e.preventDefault()

        if (!experienceText) return

        // @ts-ignore
        setExperiences([...experiences, {_id: nanoid(), name: experienceText, date: experienceDate}])
        setExperienceText('')
    }

    const removeExperience = (id: string) => {
        setExperiences(experiences.filter(experience => experience._id !== id))
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div>
                <label htmlFor="about">ABOUT: </label>
                <input id="about" value={about} onChange={e => setAbout(e.target.value)}/>
            </div>
            <br/>
            <form onSubmit={addInterest}>
                <label htmlFor="interests">INTERESTS: </label>
                <input id="interests" type="text" value={interest} onChange={e => setInterest(e.target.value)}/>
                <button>Add interest</button>
                <ul>
                    {interests.map(interest => (
                        <li key={interest._id}>
                            {interest.name}
                            <button onClick={() => removeInterest(interest._id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
            <br/>
            <form onSubmit={addEducation}>
                <label htmlFor="education">EDUCATION: </label>
                <input id="education" type="text" value={educationText}
                       onChange={e => setEducationText(e.target.value)}/>
                <input type="date" value={educationDate} onChange={e => setEducationDate(e.target.value)}/>
                <button>Add Education</button>
                <ul>
                    {education.map(education => (
                        <li key={education._id}>
                            {education.name} {new Date(education.date).toLocaleDateString()}
                            <button onClick={() => removeEducation(education._id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
            <br/>
            <form onSubmit={addSkill}>
                <label htmlFor="skills">SKILLS: </label>
                <input id="skills" type="text" value={skill} onChange={e => setSkill(e.target.value)}/>
                <button>Add Skill</button>
                <ul>
                    {skills.map(skill => (
                        <li key={skill._id}>
                            {skill.name}
                            <button onClick={() => removeSkill(skill._id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
            <br/>
            <form onSubmit={addExperience}>
                <label htmlFor="experiences">EXPERIENCES: </label>
                <input id="experiences" type="text" value={experienceText}
                       onChange={e => setExperienceText(e.target.value)}/>
                <input type="date" value={experienceDate} onChange={e => setExperienceDate(e.target.value)}/>
                <button>Add Experience</button>
                <ul>
                    {experiences.map(experience => (
                        <li key={experience._id}>
                            {experience.name} {new Date(experience.date).toLocaleDateString()}
                            <button onClick={() => removeExperience(experience._id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
            <button onClick={submit} className="btn" style={{width: '100%', marginTop: '20px'}}>Update</button>
        </Modal>
    )
}

export default RightSideEditModal
