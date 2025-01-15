import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabase";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const Create = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  }
  const CreateData = async (e) => {
    e.preventDefault();

    let thumbnailPath = null;
    if (file) {
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        thumbnailPath = uploadedFile;
      }
    }

    const newFormData = {
      ...formData,
      thumbnail: thumbnailPath
    }
    const { error } = await supabase
      .from('portfolio')
      .insert(newFormData)
    console.log(error);
    if (error) {
      alert('데이터 입력 실패');
      console.log(error);
    } else {
      alert('데이터 입력 성공');
      setFormData({
        title: '',
        content: ''
      })
      setFile(null);
      document.querySelector('#thumbnail').value = '';
    }
  }
  //CreateData();

  async function uploadFile(file) {
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = `thumbnail/${uniqueFileName}`;
    const { data, error } = await supabase.storage.from('portfolio').upload(filePath, file)
    if (error) {
      // Handle error
      console.log('파일 업로드 실패', error);
    } else {
      // Handle success
      console.log('파일 업로드 성공', data);
      return filePath;
    }
  }

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (
      <div>
        <Header />
        <main class="content">
          <div class="container about_content shadow">
            <div class="form">
              <h3 class="heading6">Create Project</h3>
              <div class="contact_form">
                <form action="" onSubmit={CreateData}>
                  <p class="field">
                    <label for="title">title:</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} placeholder="Project title" />
                  </p>
                  <p class="field">
                    <label for="project-desc">Project Description:</label>
                    <textarea name="content" id="project-desc" value={formData.content} onChange={handleChange} cols="30" rows="10" placeholder="project description"></textarea>
                  </p>
                  <p class="field">
                    <label for="thumbnail">thumbnail:</label>
                    <input type="file" name="thumbnail" onChange={handleFileChange} id="thumbnail" />
                  </p>
                  <p class="submit">
                    <input type="submit" class="primary-btn" value="Save Project" />
                  </p>
                </form>
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    )
  }
};

export default Create;
