const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-wrap">
    <div className="spinner" />
    <p className="loader-text">{text}</p>
  </div>
);

export default Loader;
