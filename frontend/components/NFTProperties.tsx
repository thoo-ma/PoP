import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles/NFTProperties.styles';
import { colors } from '../constants';

interface NFTPropertiesProps {
  efficiency: number;
  resilience: number;
  comfort: number;
  luck: number;
  energy?: number;
  mode?: 'compact' | 'detailed';
  excludeProperties?: string[];
}

interface PropertyBarProps {
  label: string;
  value: number;
  color: string;
  isCompact: boolean;
}

const PropertyBar = React.memo(function PropertyBar({ label, value, color, isCompact }: PropertyBarProps) {
  return (
    <View style={isCompact ? styles.propertyRowCompact : styles.propertyRowDetailed}>
      <Text style={isCompact ? styles.propertyLabelCompact : styles.propertyLabelDetailed}>
        {label}
      </Text>
      <View style={isCompact ? styles.propertyBarWrapperCompact : styles.propertyBarWrapperDetailed}>
        <View style={[isCompact ? styles.propertyBarBackgroundCompact : styles.propertyBarBackgroundDetailed]}>
          <View 
            style={[
              isCompact ? styles.propertyBarFillCompact : styles.propertyBarFillDetailed, 
              { width: `${value}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={isCompact ? styles.propertyValueCompact : styles.propertyValueDetailed}>
          {Math.round(value)}
        </Text>
      </View>
    </View>
  );
});

function NFTProperties({ 
  efficiency, 
  resilience, 
  comfort, 
  luck, 
  energy,
  mode = 'compact',
  excludeProperties = []
}: NFTPropertiesProps) {
  const isCompact = mode === 'compact';
  
  const properties = [
    { label: 'Efficiency', value: efficiency, color: colors.efficiency },
    { label: 'Resilience', value: resilience, color: colors.resilience },
    { label: 'Comfort', value: comfort, color: colors.comfort },
    { label: 'Luck', value: luck, color: colors.luck },
  ];

  // Only add energy if it's provided
  if (energy !== undefined) {
    properties.push({ label: 'Energy', value: energy, color: colors.energy });
  }

  // Filter out excluded properties
  const filteredProperties = properties.filter(prop => !excludeProperties.includes(prop.label));

  return (
    <View style={isCompact ? styles.containerCompact : styles.containerDetailed}>
      {filteredProperties.map((prop) => (
        <PropertyBar 
          key={prop.label}
          label={prop.label}
          value={prop.value}
          color={prop.color}
          isCompact={isCompact}
        />
      ))}
    </View>
  );
}

export default React.memo(NFTProperties);
