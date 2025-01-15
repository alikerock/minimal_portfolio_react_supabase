import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabase";

const PortfolioSingle = ({ data }) => {
  const { id } = useParams(); // URL의 id를 가져옴
  const currentId = parseInt(id, 10); // id를 숫자로 변환
  const [project, setProject] = useState([])

  useEffect(() => {
    async function fetchProject() {
      const { data: project } = await supabase.from('portfolio').select().eq('id', currentId)
      console.log(project[0]);
      if (project.length > 0) {
        setProject(project[0])
      }
    }

    fetchProject()
  }, [currentId])

  // const item = data[currentId];

  // if (!item) return <p>Item not found</p>;

  // // 이전/다음 프로젝트 ID 계산
  // const prevId = currentId > 0 ? currentId - 1 : null;
  // const nextId = currentId < data.length - 1 ? currentId + 1 : null;

  return (
    <>
      <Header />
      <main className="content portfolio-single">
        <div className="container">
          <div className="row">
            <div className="col-md-8 description">
              <div className="contents shadow">
                {/* <img src={project.description1} alt={`${item.title}`} /> */}
                <p>image description 1</p>
              </div>
              <div className="contents shadow">
                {/* <img src={item.images.description2} alt={`${item.title}`} /> */}
                <p>image description 2</p>
              </div>
            </div>
            <div className="col-md-4 portfolio_info">
              <div className="contents shadow">
                <h2>{project.title}</h2>
                <p>{project.content}</p>
                <p className="link">
                  <a href="/">Visit site &rarr;</a>
                </p>
                <hr className="double" />
                <blockquote>
                  {/* <p>{project.review.content}</p> */}
                  {/* <small>- {item.review.writer}</small> */}
                </blockquote>
                <p className="nav">

                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PortfolioSingle;
