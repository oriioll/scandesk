<?php

namespace App;

enum HistoryAction: string
{
    case Create = 'create';
    case Delete = 'delete';
    case Edit = 'edit';
}
