import React, { Component, Fragment  } from "react";
import { withRouter } from "react-router-dom";
import { logout } from "../../services/auth";

import Dimensions from "react-dimensions";
import "./styles.css";
import MapGL from "react-map-gl";
import PropTypes from "prop-types";


import debounce from "lodash/debounce";
import api from "../../services/api";

import Properties from "./components/Properties";

const TOKEN =
  "pk.eyJ1IjoiZmFiaW9yYW1vc2FsdnNlIiwiYSI6ImNrOGRrY2RoNjB2OXgzZG8xZ2QzMDZ6ZXMifQ.zZMaJgMr7_ZyOfVsKIku0g";

class Map extends Component {
  
    handleLogout = e => {
        logout();
        this.props.history.push("/");
      };

      renderActions() {
        return (
          <div button-container>
            <button color="#222" onClick={this.handleLogout}>
              <i className="fa fa-times" />
            </button>
          </div>
        );
      }

    constructor() {
        super();
        this.updatePropertiesLocalization = debounce(
          this.updatePropertiesLocalization,
          500
        );
      }
  
    static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  };

  state = {
    viewport: {
      latitude: -23.660776,
      longitude: -46.437308,
      zoom: 15.8,
      bearing: 0,
      pitch: 0
    },
    properties: []
  };

  componentDidMount() {
    this.loadProperties();
  }
  
  updatePropertiesLocalization() {
    this.loadProperties();
  }

  loadProperties = async () => {
    const { latitude, longitude } = this.state.viewport;
    try {
      const response = await api.get("/properties", {
        params: { latitude, longitude }
      });
      this.setState({ properties: response.data });
    } catch (err) {
      console.log(err);
    }
  }; 
  
  render() {
    const { containerWidth: width, containerHeight: height } = this.props;
    const { properties } = this.state;
    return (
    <Fragment>
      <MapGL
        width={width}
        height={height}
        {...this.state.viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={TOKEN}
        onViewportChange={viewport => this.setState({ viewport })}
        onViewStateChange={this.updatePropertiesLocalization.bind(this)}
      >
     <Properties properties={properties} />
      </MapGL>
      {this.renderActions()}
      </Fragment>
    );
  }
}

const DimensionedMap = withRouter(Dimensions()(Map));
const App = () => (
  <div className="container">
    <DimensionedMap />
  </div>
);

export default App;