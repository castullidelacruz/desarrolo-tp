import React from "react";
import "./Hero.css";
import { Button, TextField } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";

const Hero = ({ filterProducts }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <section className="hero" id="productos">
      <div className="hero__grid">
        <div className="hero__copy">
          <h2 className="hero__title">Todo lo que te ilumina</h2>
          <p className="hero__text">
            Descubrí productos brillantes que llenan tu día de energía.
          </p>
        </div>
        <div className="hero__search">
          <div className="input-wrapper">
            <TextField
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              fullWidth
              variant="standard"
              placeholder="¿Qué producto buscas?"
            />
          </div>

          <Button
            className="search-button button--primary"
            variant="outlined"
            onClick={() => filterProducts(searchText)}
          >
            <FaSearch className="button-icon" />
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  filterProducts: PropTypes.func.isRequired,
};
export default Hero;
