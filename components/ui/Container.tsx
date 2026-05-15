import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Container({ children, style }: Props) {
  const { px } = useResponsive();
  return (
    <View
      style={[
        {
          maxWidth: 1100,
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: px,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
