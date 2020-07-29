/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import MachineLearningModule from "./views/MachineLearningModule";
import OnlineSupport from "./views/OnlineSupport";
import Home from "./views/Home";
import ChatModule from "./views/ChatModule";
import DataProcessing from "./views/DataProcessing";

var routes = [
	{
		path: "/home",
		name: "Home",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-bank",
		component: Home,
		layout: "/user"
	},
	{
		path: "/onlinesupport",
		name: "Online Support Module",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-support-17",
		component: OnlineSupport,
		layout: "/user"
	},
	{
		path: "/chat",
		name: "Chat module",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-chat-33",
		component: ChatModule,
		layout: "/user"
	},
	{
		path: "/dataprocessing",
		name: "Data Processing",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-tag",
		component: DataProcessing,
		layout: "/user"
	},
	{
		path: "/machinelearning",
		name: "Machine Learning Module",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-molecule-40",
		component: MachineLearningModule,
		layout: "/user"
	},
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Dashboard,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-atom",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/map",
  //   name: "Map",
  //   rtlName: "خرائط",
  //   icon: "tim-icons icon-pin",
  //   component: Map,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: "tim-icons icon-bell-55",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "tim-icons icon-puzzle-10",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: "tim-icons icon-align-center",
  //   component: Typography,
  //   layout: "/admin"
  // },

];
export default routes;
