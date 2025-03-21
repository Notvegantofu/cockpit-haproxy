import cockpit from 'cockpit';
import { mapLocation, domainmap } from './DomainTable'

export async function createBackup() {
  const timestamp = new Date().toISOString().slice(0, 19);
  const backUpFile = `${mapLocation}/${timestamp}-hosts.map.bak`
  return cockpit.spawn(['cp', domainmap, backUpFile], {superuser: 'require'})
    .then(() => cockpit.spawn(['ls', '-1', mapLocation]))
    .then(output => output.split('\n').filter(line => line.includes('hosts.map.bak')).sort())
    .then(lines => {
      const oldest = [];
      while (lines.length > 10) {
        oldest.push(`${mapLocation}/${lines.shift()}`);
      }
      return oldest;
    })
    .then(oldest => cockpit.spawn(['rm', '-f'].concat(oldest), {superuser: 'require'}));
}