import Card from '../UI/Card/Card';
import classes from './Home.module.css';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
          <title>Home Page</title>
        </Helmet>
      <Card className={classes.home}>
        <h1>here is the main part of the project</h1>
      </Card>
    </>
  );
};

export default Home;
