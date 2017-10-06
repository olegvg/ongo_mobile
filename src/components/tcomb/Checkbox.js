import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { FormLabel, FormValidationMessage } from '@ui/';
import { Actions } from 'react-native-router-flux';
import { AppColors } from '@theme/';

function checkbox(locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let checkboxStyle = stylesheet.checkbox.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;

  if (locals.hasError) {
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  const additionalStyles = StyleSheet.create({
    formLabel: {
      fontStyle: 'italic',
      color: AppColors.textPrimary,
      fontWeight: 'bold',
    },
    underlinedText: {
      textDecorationLine: 'underline',
    },
  });
  const scene = locals.config.scene ? Actions[locals.config.scene] : null;
  const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  const error = locals.hasError && locals.error ? <FormValidationMessage>{locals.error}</FormValidationMessage> : null;

  let underlined = false;
  const label = locals.label.split(' ').map((p, i) => {
    if (p === '_') {
      underlined = !underlined;
      return null;
    }
    return <Text key={i} style={underlined ? additionalStyles.underlinedText : null}>{p}</Text>;
  }).reduce((reduced, curr) => {
    return [reduced, ' ', curr];
  });

  return (
    <View>
      <TouchableOpacity onPress={scene}>
        <FormLabel>
          {label}
        </FormLabel>
      </TouchableOpacity>
      <Switch
        accessibilityLabel={locals.label}
        ref="input"
        disabled={locals.disabled}
        onTintColor={locals.onTintColor}
        thumbTintColor={locals.thumbTintColor}
        tintColor={locals.tintColor}
        style={checkboxStyle}
        onValueChange={value => locals.onChange(value)}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

export default checkbox;
