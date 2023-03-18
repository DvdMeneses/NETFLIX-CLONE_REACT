import React,{ useEffect, useState } from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import "./App.css";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

export default () =>{

  const [movieList, setMovieList] = useState([]);//lista de filmes
  const [featuredData, setFeaturedData] = useState(null); //campo de destaque
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //get the featured
      //usaremos os originais netflix como apoio para os featured,pois para mostrar o filme como destaque a api ja deve ter sido carregada
      let originals = list.filter(i=>i.slug === 'originals');//filtrando os filmes pelo slug para termos so os originais netflix
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))//gerando numero aleatorio para ser o indice aleatorio do filme
      let chosen = originals[0].items.results[randomChosen];//filme aleatorio escolhido
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id,'tv');
      setFeaturedData(chosenInfo);
      
    }
    
    loadAll();
  }, []);

  useEffect(()=>{
      const scrollListener = ()=>{
        if(window.scrollY > 10){
          setBlackHeader(true);
        }else{
          setBlackHeader(false);
        }
      }

      window.addEventListener('scroll',scrollListener);

      return()=>{
        window.removeEventListener('scroll',scrollListener);
      }

  },[]);




  return(
    <div className="page">
      <Header black={blackHeader}/>
      {featuredData &&
      <FeaturedMovie item={featuredData}/>}


      <section className="lists">
        {movieList.map((item,key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      


      <footer>
        Contact me through the email: <strong>david.meneses.cc@gmail.com</strong><span role="img" aria-label="PC"> 💻<br/></span>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>
    </div>
    
  );
  
  
}

