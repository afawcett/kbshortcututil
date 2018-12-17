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
    /**
     * Runs the given Flow
     **/
    runFlow : function(component, flowType, flow) {
        // Dynamically creating the lightning:flow component here since it appears not to all Flows to be restarted
        var helper = this;
        if(flowType === 'flowauto') { // Auto launch flow?
            $A.createComponent("lightning:flow", { 'onstatuschange' : component.getReference('c.onFlowStatusChange') }, 
                function(newFlow, status, errorMessage) {
                    if (status === "SUCCESS") {
                        component.set("v.body", [ newFlow ]);
                        newFlow.startFlow(flow, [] );
                    } else {
                        helper.error('Failed to create lightning:flow component ' + errorMessage);
                    }
                });
        } else if(flowType === 'flowui') { // UI flow?
            component.set("v.body", [ ]);
            $A.createComponent("lightning:flow", { 'onstatuschange' : component.getReference('c.onFlowStatusChange') }, 
                function(newFlow, status, errorMessage) {
                    if (status === "SUCCESS") {
                        newFlow.startFlow(flow, [] );
                        component.set("v.modalPromise", 
                            component.find('overlayLib').showCustomModal({
                            header: "Keyboard Shortcut Flow",
                            body: newFlow, 
                            showCloseButton: true}));
                    } else {
                        helper.error('Failed to create lightning:flow component ' + errorMessage);
                    }
                });
        }
    },
    /**
     * Parses a collection of output variables from a flow and invokes various actions, runs another flow, lex event
     **/
	handleFlowOutput : function(component, flow, outputVariables) {
	    var flowToRun = null;
        var eventToFire = null;
        var eventParams = {};
        var outputVar;	
        var helper = this;
        for(var i = 0; i < outputVariables.length; i++) {
            outputVar = outputVariables[i];
            if(outputVar.value == null) {
            	continue;
            }
            if(outputVar.name === 'kbs_runFlow') {
                flowToRun = outputVar.value;
            } else if(outputVar.name === 'kbs_event') {
                eventToFire = $A.get(outputVar.value);
                if(eventToFire == null) {
                    helper.error('kbs_event ' + outputVar.value + ' does not exist');
                }
            } else if (outputVar.name.startsWith('kbs_param')) {
                var paramName = outputVar.name.split('_')[2];
                eventParams[paramName] = outputVar.value; 
            } else {
                helper.error('Unexpected variable ' + outputVar.name + ' returned from flow ' + flow);            
            }              
        }
        if(eventToFire!=null) {
            // This approach in theory allows a wide selection of events to be fired, such as the navigation ones
            eventToFire.setParams(eventParams);
            eventToFire.fire();
        }
        if(flowToRun!=null) {
            // This allows an auto launch flow to run another flow
            var flowToRunReg = /(flowui|flowauto):(.*)/;
            if(flowToRunReg.test(flowToRun)) {
                var flowRunGroups = flowToRunReg.exec(flowToRun);
                this.runFlow(component, flowRunGroups[1], flowRunGroups[2]);
            }
        }		
    },
    /**
     * Simple toast error
     */
	error : function(error) {
	    var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({ "title" : "Keyboard Shortcuts Component", "type" : "error", "message": error });
        toastEvent.fire();	    
	}    
})