import { Outlet } from "react-router-dom";

function InteractiveMode(){
	return(
		<div>			
			<Outlet/>
		</div>
	)
};

export default InteractiveMode;