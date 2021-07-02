import * as React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Container, Text, CheckBox} from '@src/components/elements';
import styles from './styles';
import {Item} from "@src/models/item";
import {Option} from "@src/models/option";
import {OptionGroup} from "@src/models/option-group";

type OptionGroupsProps = {
  data: Item;
  addOptionToBasket: (option: Option, section: OptionGroup) => void;
};

const OptionGroups: React.FC<OptionGroupsProps> = ({
  data: {optionGroups},
  addOptionToBasket,
}) => {
  const {
    colors: {border},
  } = useTheme();
  const onCheckBoxPress = (selectedDish: Option, section: OptionGroup) => {
    return addOptionToBasket(selectedDish, section);
  };

  return (
    <View>
      {optionGroups?.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          <Text style={styles.sectionTitle}>
            {section.name}
            <Text style={{fontSize: 15}}>
              {section.type === 'pickable' ? ` (Escolha ${section.amountOptionsRequired})` : ''}
            </Text>
          </Text>
          {section.options.map((option, dishIndex) => (
            <Container
              key={dishIndex}
              style={[styles.dishItemContainer, {borderBottomColor: border}]}>
              <Container style={styles.checkBoxContainer}>
                <CheckBox
                  label={option.name}
                  onPress={onCheckBoxPress(option, section)}
                  rightElement={section.type === 'addable' ? <Text>+ €{option.price}</Text> : <Text> </Text>}
                />
              </Container>
            </Container>
          ))}
        </View>
      ))}
    </View>
  );
};

export default OptionGroups;
