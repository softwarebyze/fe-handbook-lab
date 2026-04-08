import { StyleSheet, Text, View } from 'react-native';

import { ContinuityFlowSim } from '@/components/sim/ContinuityFlowSim';
import { FirstOrderSim } from '@/components/sim/FirstOrderSim';
import { MomentArmSim } from '@/components/sim/MomentArmSim';
import { OhmLawSim } from '@/components/sim/OhmLawSim';
import { SecondOrderStepSim } from '@/components/sim/SecondOrderStepSim';
import { SpringDamperSim } from '@/components/sim/SpringDamperSim';
import { StressStrainSim } from '@/components/sim/StressStrainSim';
import { useAppColors } from '@/hooks/useAppColors';

type Props = { simId: string };

export function SimView({ simId }: Props) {
  const { colors } = useAppColors();

  switch (simId) {
    case 'spring-damper':
      return <SpringDamperSim />;
    case 'second-order-step':
      return <SecondOrderStepSim />;
    case 'first-order-tau':
      return <FirstOrderSim />;
    case 'moment-arm':
      return <MomentArmSim />;
    case 'ohms-law':
      return <OhmLawSim />;
    case 'continuity-flow':
      return <ContinuityFlowSim />;
    case 'stress-strain':
      return <StressStrainSim />;
    default:
      return (
        <View style={styles.fallback}>
          <Text style={{ color: colors.textSecondary }}>Unknown simulator.</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  fallback: { padding: 24 },
});
