param (
    [Parameter( ValueFromPipeLine=$true, 
                ValueFromPipeLineByPropertyName=$true,
                ParameterSetName="Username",
                HelpMessage="Username to add to credential")]
    [Alias('user')]
    [string]$Username = '',

    [Parameter( ValueFromPipeLine=$true, 
            ValueFromPipeLineByPropertyName=$true,
            ParameterSetName="Target",
            HelpMessage="Target to add to credential")]
    [Alias('target')]
    [string]$Target = '',

    [Parameter( ValueFromPipeLine=$true, 
            ValueFromPipeLineByPropertyName=$true,
            ParameterSetName="Password",
            HelpMessage="Password to add to credential")]
    [Alias('pass')]
    [string]$Password = '',
)


$cred = New-StoredCredential -Target $Target -Username $Username -Password $Password -Comment '' -Persist LocalMachine -ErrorAction SilentlyContinue -ErrorVariable err;

if($err)
{
    $err = ConvertTo-Json $err -Compress
}
else
{
    $cred = ConvertTo-Json $cred -Compress
}