import { Component, ComponentRef, OnInit } from '@angular/core';
import { ComponentRegistry } from './component-registry';
import { CdkPortalOutletAttachedRef, ComponentPortal } from '@angular/cdk/portal';
import { BaseCardComponent } from './types';


interface PortalWithData {
  portal: ComponentPortal<any>;
  data: any;


}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  FAKE_SERVER_DATA = [
    {
      '__typename': 'card-a',   // we use the __typename as ID for the component map
      'text': 'Card A Text',
      'color': 'aliceblue'
    },
    {
      '__typename': 'card-b',
      'button': 'Card B Button',
      'color': 'floralwhite'
    },
    {
      '__typename': 'card-c',
      'color': 'snow',
      'input': 'Card C',
      'label': 'Card C label',
      'placeholder': 'my placeholder'
    },
  ]

  portalsWithData: PortalWithData[] = [];

  constructor(private componentRegistry: ComponentRegistry) {
    this.componentRegistry.logRegisteredComponents();

  }

  ngOnInit(){
    this.FAKE_SERVER_DATA.forEach(data => {
      // retrieve the fitting Component Class based on the __typename from the server data
      const compClass = this.componentRegistry.getComponent(data.__typename);
      // if no component is registered we ignore that server data element
      if (!compClass) return;
      // create the new component portal based on the retrieved component class
      const newPortal = new ComponentPortal(compClass);
      // append the portal to the list of portals
      this.portalsWithData.push({portal: newPortal, data: data});
    });

  }

  initPortalComponentData(ref: CdkPortalOutletAttachedRef, data: any) {
    // when a portal got attached to the portal outlet this method is called to
    // set the data from the server so that the component can use
    ref = ref as ComponentRef<BaseCardComponent>;
    ref.instance.data = data;
  }
}
