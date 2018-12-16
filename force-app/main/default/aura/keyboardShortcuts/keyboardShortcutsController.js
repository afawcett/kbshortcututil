/**
 * Copyright (c) 2018, Andrew Fawcett
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, 
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, 
 *      this list of conditions and the following disclaimer in the documentation 
 *      and/or other materials provided with the distribution.
 * - Neither the name of the Andrew Fawcett, nor the names of its contributors 
 *      may be used to endorse or promote products derived from this software without 
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL 
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

({
	init: function(component, event, helper) {

        // Build shortcut map
        var shortCutReg = /(Ctrl|Alt|Shift)\+(.) (flowui|flowauto|navigate):(.*)/;
        var shortcuts = new Map();
        for(var idx=1; idx<10; idx++) {
            var shortcut = component.get('v.shortcut'+idx);
            if(shortCutReg.test(shortcut)) {
                var groups = shortCutReg.exec(shortcut);
                var shortcutKey = groups[1]+'+'+groups[2].toLowerCase();
                var shortcutActionType = groups[3];
                var shortcutAction = groups[4]; 
                shortcuts.set(shortcutKey, { type: shortcutActionType, name: shortcutAction});
            }
        }

        // Handler to match against shortcut map and run action
		window.addEventListener('keydown', function(e) {            
            var key1 = e.shiftKey ? 'Shift+' : '' + e.altKey ? 'Alt+' : '' + e.ctrlKey ? 'Ctrl+' : '';
            var key2 = e.key.toLowerCase();
            var action = shortcuts.get(key1+key2);
            // TODO: Probably best to move action handling into the helper!
            if(action!=null) {
                // Flow actions
                if(action.type.startsWith('flow')) {
                    helper.runFlow(component, action.type, action.name);
                // Nav actions
                } else if(action.type.startsWith('navigate')) {
                    if(action.name === 'home') {
                        $A.get('e.force:navigateToURL').fire({ url: '/lightning/page/home' });
                    }
                }
			} 
		});
    },
    
    /**
     * Fired when the Flow component completes a Flow
     **/
    onFlowStatusChange : function(component, event, helper) {
        if(event.getParam("status") === "FINISHED" || event.getParam("status") == 'FINISHED_SCREEN') {
            // Flow modal open?
            var modalPromise = component.get('v.modalPromise');
            if(modalPromise!=null) {
                modalPromise.then( function (modal) { modal.close(); } );
            }
            // Handle Flow output vars
            var outputVariables = event.getParam("outputVariables");
            if(outputVariables!=null) {
                helper.handleFlowOutput(component, event.getParam('flowTitle'), outputVariables);
            }
        } else if (event.getParam("status") === "Error") {
            helper.error("Keyboard Shortcuts component failed to load the Flow");
        }
    }    
})