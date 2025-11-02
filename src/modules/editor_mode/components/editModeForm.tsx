import { useState, type FormEvent } from 'react';
import styles from './editModeForm.module.css';
import { type Option } from '../../../configs/option.ts';
import { useNavigate } from 'react-router-dom';
import CourseService from '../../../services/course.service.ts';


function EditModeForm(){
    const navigate = useNavigate();
    const staticOption:Option = { value: 'Not Part Of A Collection', label: 'Not Part Of A Collection' };
    let userCollect:Option[] = [
      { value: 'Web Development Basics', label: 'Web Development Basics' }
    ];
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        CourseService.createCourse({
            courseName: form.courseName,
            courseDescription: form.courseDescription,
            prerequisites: form.prerequisites,
            price: form.price,
            accessPeriod: form.accessPeriod,
            courseCollection: form.courseCollection
        }).then((arr)=>{
            if (arr.status === 200 && arr.data.message === "Course Created Successfully")
            {
                const link:string = `/edit/${form.courseCollection}/${arr.data.main.id}/${form.courseName}`;
                navigate(link.split(" ").join("-").toLowerCase());
            }else{
                setLoading(false);
            }
        }).catch(e=>{
            setLoading(false);
            console.log(e)});
    };
    
    return(
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
            <div className="max-w-6xl mx-auto">   
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
                    <p className="text-slate-600 mt-2">Create and customize your course to share knowledge, engage learners, and achieve educational success.</p>
                </header>
            </div>            
            <form onSubmit={handleSubmit} method="post" className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
                <div>
                    <label htmlFor="courseName">Course Name</label>
                </div>
                <input
                    id="courseName" 
                    className="w-full mt-2 px-3 py-2 border rounded-md"
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
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                    value={form.courseDescription}
                    onChange={handleInputChange}
                    required
                />

                <div>
                    <label htmlFor="prerequisites">Prerequisites</label>
                </div>
                <input
                    id="prerequisites"
                    className="w-full mt-2 px-3 py-2 border rounded-md"
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
                    className="w-full mt-2 px-3 py-2 border rounded-md"
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
                    className="w-full mt-2 px-3 py-2 border rounded-md"
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
                    <select
                    className="w-full mt-2 px-3 py-2 border rounded-md" id="courseCollection" name="courseCollection" value={form.courseCollection} onChange={handleCollectionChange}>
                        <option value="" disabled> -- Please choose an option -- </option>
                        <option value={staticOption.value}> {staticOption.label} </option>
                        {
                            userCollect.map(opt =>
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            )
                        }
                    </select>
                </div>

                <button type="submit" className={`bg-blue-600 text-white hover:opacity-95 px-4 py-2 mt-4 rounded-lg font-semibold focus:outline-none ${loading ? styles.loading : ""}`} disabled={loading}>Save</button>
            </form>
        </div>
    )
};
export default EditModeForm;