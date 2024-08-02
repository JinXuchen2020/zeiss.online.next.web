import ReactDOM from 'react-dom';
import './styles/index.css';
import { CourseManage, Main, NoPermission, Home, AuthRedirect, UserCourses, Users, HomeConfig, Login, Courses, Tags, GroupsV2, GroupManage, Reports, Managers, EmployeeUsers } from './pageComponents';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isWxBrowser, isWxWorkBrowser } from 'models';

ReactDOM.render(
  <BrowserRouter basename='/admin'>
    <Routes>
      <Route path="login" element={
        //isWxBrowser() ? 
        <Login /> 
        //: //<NoPermission />
      } />
      <Route path="authorize" element={<AuthRedirect />} />
      <Route path="" element={
        //isWxBrowser() ? 
        <Main /> 
        //: <NoPermission />
      }>
        <Route path="" element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="publishCourses" element={<Courses publish={true} />} />
        <Route path="courses/:courseId" element={<CourseManage />} />
        <Route path="publishCourses/:courseId" element={<CourseManage />} />
        <Route path="courses/create" element={<CourseManage />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<UserCourses />} />
        <Route path="groups" element={<GroupsV2 />} />
        <Route path="groups/create" element={<GroupManage />} />
        <Route path="groups/:managerId" element={<GroupManage />} />
        <Route path="homeConfig" element={<HomeConfig />} />
        <Route path="tags" element={<Tags />} />
        <Route path="reports" element={<Reports />} />
        <Route path="managers" element={<Managers />} />
        <Route path="employeeUsers" element={<EmployeeUsers />} />
      </Route>
    </Routes>    
  </BrowserRouter>,
  document.getElementById('root')
);
