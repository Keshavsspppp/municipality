const { exec } = require('child_process');
const path = require('path');

const runScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptPath}:`, error);
        reject(error);
        return;
      }
      console.log(`Output from ${scriptPath}:`, stdout);
      if (stderr) {
        console.error(`Errors from ${scriptPath}:`, stderr);
      }
      resolve();
    });
  });
};

const seedAll = async () => {
  try {
    // Get the directory of the current script
    const scriptDir = __dirname;
    
    // Run departments seed first
    console.log('Seeding departments...');
    await runScript(path.join(scriptDir, 'seedDepartments.js'));
    
    // Run forums seed second
    console.log('Seeding forums...');
    await runScript(path.join(scriptDir, 'seedForums.js'));
    
    console.log('All seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

// Run the seeding process
seedAll(); 