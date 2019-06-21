export const calculateDamage = (stats, attacker, target, option) => {

  // Normal attack
  if(option === 'Attack') {
    const damage = stats[attacker].attack - stats[target].defense;
    if(damage > 0) {
      stats[target].hp -= damage;
    }
  }

  // Magic attack
  else if(typeof option === 'number') {
    const damage = stats[attacker].magic - stats[target].mdef;
    if(damage > 0) {
      stats[target].hp -= damage;
    }
  }

  else if(typeof option === 'string' && option.startsWith('enemy')) {
    const damage = stats[attacker].attack - stats[target].defense;
    if(damage > 0) {
      stats[target].hp -= damage;
    }
  }

  return stats;
}