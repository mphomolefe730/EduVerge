export default function EditCollection() {
    
    const HandleSubmit = (e:any) => {
        e.preventDefault();
        console.log("submitted");
    }

    return(
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
            <div className="max-w-6xl mx-auto">   
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Manage Your Course Collections</h1>
                    <p className="text-slate-600 mt-2">Organize, update, and track all your course collections in one place to deliver a seamless learning experience.</p>
                </header>            
                <form onSubmit={HandleSubmit} method="post" className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
                </form>
            </div>
        </div>
    )
}