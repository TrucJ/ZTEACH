import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Tutors.css';
import Navbar from '../Navbar';
import Search from './Search';
import TutorItem from './TutorItem';
import validate from './validateInfo';
import axios from 'axios';


import footer_image1 from '../images/searchimg/img1.png';
import footer_image2 from '../images/searchimg/img2.png';
import footer_image3 from '../images/searchimg/img3.png';
import footer_image4 from '../images/searchimg/img4.png';
import footer_image5 from '../images/searchimg/img5.png';
import { isPlainObject } from 'jquery';


function Tutors() {
    const footer_images = [footer_image1, footer_image2, footer_image3, footer_image4, footer_image5];
    const num_footer_image = 5;
    const [footer_image, set_footer_image] = useState(null);

    const PPP = 10;     //num of posts per page
    
    const defaultValues = {
        unstable: false,
        page: "1",
        name: "",
        subjects: "",
        classes: "",
        literacy: "",
        gender: "",
        older: "",
        younger: "",
        fee: "",
        exp: "",
        rate: "",
    };
    const submitForm = () => {
        console.log("Submitted");
    }
    const navigate = useNavigate();
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    function reload() {
        var url = '/tutor-list?';

        for (var key in values) {
            if (key === "unstable") continue;

            if (values[key] !== "") url = url + key + "=" + values[key] + "&";
        }
        
        navigate(url);
        fetchData();
    }
    
    const fetchData = async () => {
        const searchURL = 'http://localhost:8000/tutors' + window.location.search;

        console.log(searchURL);
        const result = await axios.get(searchURL);

        
        var url = require('url');
        var url_parts = url.parse(searchURL, true);
        var query = url_parts.query;
        var newValues = values;
        for (var key in query){
            var value = query[key];
            if (key === "page"){
                if (value < 1)
                    value = 1;
                if (value > Math.ceil(result.data.number / PPP)) 
                    value = Math.ceil(result.data.number / PPP);
            }
            newValues = {...newValues,[key]:value};
        }
        newValues = {...newValues,unstable:false};
        setValues(newValues);

        setData(result.data);

        set_footer_image(footer_images[Math.floor(Math.random() * num_footer_image)]);
    };

  
    const handleChange = e => {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value
      });
    };
  
    const handleChangePage = e => {
      const { name, value } = e.target;
      if (0 < value && value <= Math.ceil(Data.number / PPP))
        setValues({
            ...values,
            [name]: value,
            unstable: true
        });
    };
    if (values.unstable) reload();

    const handleDelete = e => {
      setValues(defaultValues);
    };
  
    const handleSubmit = e => {
      e.preventDefault();
  
      setErrors(validate(values));
      setIsSubmitting(true);
  
  
      reload();
    };
  




    const [Data, setData] = useState({
        number: 0,
        tutors: []
    });
    
    useEffect(() => {
        fetchData();
    }, []);

    
    return (
        <div>
        <div style={{height: '10%', width: '100%', position: 'absolute'}}>
            <Navbar/>
        </div>
        <div className='posts-grid-main-layout40'>
            <Search params={{handleChange, handleSubmit, handleDelete, values, errors}}/>
            <div className='post-items-list-parent-layout40'>
            <div className='post-items-list-layout40'>
                <div className='header-frame40'>
                    <div>
                        <div className='title1-40'>Tìm thấy {Data.number} gia sư</div>
                    </div>
                    <Link to="/post-list" className="transform-post-tutor-40">Chuyển đến danh sách bài đăng</Link>
                </div>
                {Data.tutors.map(item => (
                    <TutorItem params={item}/>
                ))}
                <div className='footer-frame40'>
                    {Data.number > PPP ?
                        <div className="footer-flex-row40">
                            <div className='title2-40'>Trang </div>
                            <input
                                type="number"
                                className="page-number40"
                                name="page"
                                value={values.page}
                                onChange={handleChangePage}
                            />
                        </div>
                    :<div/>}
                    <img className="user-img-tutor-item40" src={footer_image} />
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Tutors;