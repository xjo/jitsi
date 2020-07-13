import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text } from "react-native";
import { MAIN_BLUE, LIGHT_GRAY, EXTRA_LIGHT_GRAY } from "../../consts/colors";

const SubmitButton = ({ onPress, name, invalid }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={invalid}
      style={{
        borderWidth: invalid ? 1 : 0,
        borderColor: LIGHT_GRAY,
        backgroundColor: invalid ? EXTRA_LIGHT_GRAY : MAIN_BLUE,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: invalid ? LIGHT_GRAY : "#ffffff",
          fontSize: 16,
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};
SubmitButton.propTypes = {
  onPress: PropTypes.func,
  name: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
};

export default SubmitButton;
