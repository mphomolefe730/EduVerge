import { useState, type FormEvent } from 'react';
import styles from './editModeForm.module.css';
import { type Option } from '../../../configs/option.ts';
import { useNavigate } from 'react-router-dom';


function EditModeForm(){
    const navigate = useNavigate();
    const staticOption:Option = { value: 'Not Part Of A Collection', label: 'Not Part Of A Collection' };
    let userCollect:Option[] = [
      { value: 'Programming 741', label: 'Programming 741' },
      { value: 'AI 700', label: 'AI 700' },
      { value: 'Information Systems ', label: 'Information Systems' },
      { value: 'Programming 731', label: 'Programming 731' },
      { value: 'Human Computer Interaction', label: 'Human Computer Interaction' },
    ];

    const [form, setForm] = useState({
        courseName: '',
        courseDescription: '',
        prerequisites: '',
        price: 0,
        accessPeriod: 0,
        courseCollection: staticOption.value,
    });

    let handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    let handleCollectionChange = (e:any) => {
        setForm(prev => ({ ...prev, courseCollection: e.target.value }));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Submitting form', form);
        const link:string = `/edit/${form.courseCollection}/${form.courseName}`;
        navigate(link.split(" ").join("-").toLowerCase());
    };
    
    return(
        <form onSubmit={handleSubmit}>
            <h1>EduVerge</h1>
            <p>Create a new course</p>
            <div>
                <label htmlFor="courseName">Course Name</label>
            </div>
            <input
                id="courseName"
                name="courseName"
                value={form.courseName}
                onChange={handleInputChange}
                type="text"
                required
            />

            <div>
                <label htmlFor="courseDescription">Course Description</label>
            </div>
            <textarea
                id="courseDescription"
                name="courseDescription"
                value={form.courseDescription}
                onChange={handleInputChange}
                required
            />

            <div>
                <label htmlFor="prerequisites">Prerequisites</label>
            </div>
            <input
                id="prerequisites"
                name="prerequisites"
                value={form.prerequisites}
                onChange={handleInputChange}
                type="text"
            />

            <div>
                <label htmlFor="price">Price</label>
            </div>
            <input
                id="price"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                type="number"
                min="0"
                step="0.01"
            />

            <div>
                <label htmlFor="accessPeriod">Access Period (days)</label>
            </div>
            <input
                id="accessPeriod"
                name="accessPeriod"
                value={form.accessPeriod}
                onChange={handleInputChange}
                type="number"
                min="0"
            />

            <div>
                <label htmlFor="courseCollection"> Course Collection </label>
            </div>
            <div>
                <select id="courseCollection" name="courseCollection" value={form.courseCollection} onChange={handleCollectionChange}>
                    <option value="" disabled> -- Please choose an option -- </option>
                    <option value={staticOption.value}> {staticOption.label} </option>
                    {
                        userCollect.map(opt =>
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        )
                    }
                </select>
            </div>

            <button type="submit">Save</button>
        </form>
    )
};
export default EditModeForm;