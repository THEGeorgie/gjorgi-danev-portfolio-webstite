document.addEventListener('alpine:init', () => {
  Alpine.data('terminal', () => ({
    command: '',
    history: [],
    commandCount: 0,
    
    executeCommand() {
      if (this.command.trim() === '') return;
      
      const cmd = this.command;
      this.command = '';
      
      // Add command to history
      this.history.push({
        id: this.commandCount++,
        command: cmd,
        output: this.processCommand(cmd)
      });
      
      // Scroll to bottom
      this.$nextTick(() => {
        const container = this.$el.querySelector('.terminal-body');
        container.scrollTop = container.scrollHeight;
      });
    },
    
    processCommand(cmd) {
      // Simple command processing
      const commands = {
        'help': 'Available commands: help, clear, date, echo',
        'clear': () => { this.history = []; return ''; },
        'date': new Date().toString(),
        'echo': cmd.substring(5) || 'Usage: echo [text]'
      };
      
      if (cmd === 'clear') return commands.clear();
      if (commands[cmd]) return commands[cmd];
      
      return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
  }));
});